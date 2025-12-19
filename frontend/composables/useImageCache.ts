/**
 * 图片缓存管理 - 使用 IndexedDB 本地存储
 * 已访问图片永久缓存，极速二次加载
 * 注意：只缓存列表缩略图，原图始终从网络加载保证质量
 */

const DB_NAME = 'imagebed-cache'
const DB_VERSION = 1
const STORE_NAME = 'thumbnails'  // 明确只缓存缩略图
const MAX_CACHE_SIZE = 500 // 最多缓存500张缩略图
const CACHE_EXPIRE_DAYS = 7 // 缓存7天后过期，保证图片更新

interface CachedImage {
  url: string
  blob: Blob
  timestamp: number
  size: number
}

let db: IDBDatabase | null = null

// 初始化 IndexedDB
const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    // SSR 保护：服务端不存在 indexedDB
    if (!process.client || typeof indexedDB === 'undefined') {
      reject(new Error('Not supported'))
      return
    }

    if (db) {
      resolve(db)
      return
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => {
      db = request.result
      resolve(db)
    }

    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        const objectStore = database.createObjectStore(STORE_NAME, { keyPath: 'url' })
        objectStore.createIndex('timestamp', 'timestamp', { unique: false })
      }
    }
  })
}

// 从缓存获取图片
const getCachedImage = async (url: string): Promise<string | null> => {
  try {
    const database = await initDB()
    const transaction = database.transaction([STORE_NAME], 'readonly')
    const objectStore = transaction.objectStore(STORE_NAME)
    const request = objectStore.get(url)

    return new Promise((resolve) => {
      request.onsuccess = () => {
        if (request.result) {
          const cached = request.result as CachedImage

          // 检查缓存是否过期
          const now = Date.now()
          const expireTime = CACHE_EXPIRE_DAYS * 24 * 60 * 60 * 1000
          if (now - cached.timestamp > expireTime) {
            // 缓存过期，删除并返回null
            const deleteTransaction = database.transaction([STORE_NAME], 'readwrite')
            const deleteStore = deleteTransaction.objectStore(STORE_NAME)
            deleteStore.delete(url)
            resolve(null)
            return
          }

          const blobUrl = URL.createObjectURL(cached.blob)
          resolve(blobUrl)
        } else {
          resolve(null)
        }
      }
      request.onerror = () => resolve(null)
    })
  } catch {
    return null
  }
}

// 缓存图片
const cacheImage = async (url: string, blob: Blob): Promise<void> => {
  try {
    const database = await initDB()

    // 检查缓存数量，超过限制则删除最旧的
    await cleanupOldCache(database)

    const transaction = database.transaction([STORE_NAME], 'readwrite')
    const objectStore = transaction.objectStore(STORE_NAME)

    const cachedImage: CachedImage = {
      url,
      blob,
      timestamp: Date.now(),
      size: blob.size
    }

    objectStore.put(cachedImage)
  } catch (error) {
    console.warn('缓存图片失败:', error)
  }
}

// 清理旧缓存
const cleanupOldCache = async (database: IDBDatabase): Promise<void> => {
  const transaction = database.transaction([STORE_NAME], 'readwrite')
  const objectStore = transaction.objectStore(STORE_NAME)
  const countRequest = objectStore.count()

  return new Promise((resolve) => {
    countRequest.onsuccess = () => {
      const count = countRequest.result
      if (count >= MAX_CACHE_SIZE) {
        const index = objectStore.index('timestamp')
        const cursorRequest = index.openCursor()
        let deleted = 0
        const toDelete = count - MAX_CACHE_SIZE + 50 // 多删除50张，避免频繁清理

        cursorRequest.onsuccess = (event) => {
          const cursor = (event.target as IDBRequest).result
          if (cursor && deleted < toDelete) {
            objectStore.delete(cursor.primaryKey)
            deleted++
            cursor.continue()
          } else {
            resolve()
          }
        }
        cursorRequest.onerror = () => resolve()
      } else {
        resolve()
      }
    }
    countRequest.onerror = () => resolve()
  })
}

// 获取图片（优先缓存）- 只用于缩略图
const loadImage = async (url: string, useCache = true): Promise<string> => {
  // 1. 如果禁用缓存（查看原图时），直接加载
  if (!useCache) {
    return url
  }

  // 2. 检查浏览器缓存开关是否启用
  if (process.client) {
    const systemSettings = useSystemSettingsStore()
    if (!systemSettings.browserCacheEnabled) {
      // 缓存未启用，直接返回原URL
      return url
    }
  }

  // 3. 尝试从缓存获取
  const cachedUrl = await getCachedImage(url)
  if (cachedUrl) {
    return cachedUrl
  }

  // 4. 从网络加载并缓存
  try {
    const response = await fetch(url)
    const blob = await response.blob()

    // 异步缓存，不阻塞返回
    cacheImage(url, blob)

    return URL.createObjectURL(blob)
  } catch (error) {
    console.error('加载图片失败:', error)
    return url // 降级返回原URL
  }
}

// 清空所有缓存
const clearCache = async (): Promise<void> => {
  try {
    const database = await initDB()
    const transaction = database.transaction([STORE_NAME], 'readwrite')
    const objectStore = transaction.objectStore(STORE_NAME)
    objectStore.clear()
  } catch (error) {
    console.error('清空缓存失败:', error)
  }
}

// 获取缓存统计
const getCacheStats = async (): Promise<{ count: number; size: number }> => {
  try {
    const database = await initDB()
    const transaction = database.transaction([STORE_NAME], 'readonly')
    const objectStore = transaction.objectStore(STORE_NAME)
    const getAllRequest = objectStore.getAll()

    return new Promise((resolve) => {
      getAllRequest.onsuccess = () => {
        const items = getAllRequest.result as CachedImage[]
        const count = items.length
        const size = items.reduce((sum, item) => sum + item.size, 0)
        resolve({ count, size })
      }
      getAllRequest.onerror = () => resolve({ count: 0, size: 0 })
    })
  } catch {
    return { count: 0, size: 0 }
  }
}

export const useImageCache = () => {
  return {
    loadImage,
    getCachedImage,
    cacheImage,
    clearCache,
    getCacheStats
  }
}

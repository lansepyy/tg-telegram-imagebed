#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
本地缓存服务模块

提供图片本地缓存功能，减少对 Telegram API 的频繁请求。
"""
import os
import shutil
from pathlib import Path
from typing import Optional, Tuple
from ..config import logger


class ImageCacheService:
    """图片本地缓存服务"""

    def __init__(self, cache_dir: str = "/app/image"):
        """
        初始化缓存服务

        Args:
            cache_dir: 缓存目录路径，默认 /app/image
        """
        self.cache_dir = Path(cache_dir)
        self._ensure_cache_dir()
        logger.info(f"图片缓存服务初始化: cache_dir={self.cache_dir}")

    def _ensure_cache_dir(self) -> None:
        """确保缓存目录存在"""
        try:
            self.cache_dir.mkdir(parents=True, exist_ok=True)
            logger.info(f"缓存目录就绪: {self.cache_dir}")
        except Exception as e:
            logger.error(f"创建缓存目录失败: {e}")

    def _get_cache_path(self, encrypted_id: str, file_ext: str = "") -> Path:
        """
        获取缓存文件路径

        使用两级目录结构避免单目录文件过多：
        /app/image/ab/cd/abcd1234.jpg

        Args:
            encrypted_id: 加密的文件ID
            file_ext: 文件扩展名（含点号，如 .jpg）

        Returns:
            缓存文件的完整路径
        """
        # 使用前4个字符创建两级目录
        if len(encrypted_id) >= 4:
            level1 = encrypted_id[:2]
            level2 = encrypted_id[2:4]
            cache_subdir = self.cache_dir / level1 / level2
        else:
            cache_subdir = self.cache_dir / "misc"

        cache_subdir.mkdir(parents=True, exist_ok=True)
        filename = f"{encrypted_id}{file_ext}"
        return cache_subdir / filename

    def get(self, encrypted_id: str, file_ext: str = "") -> Optional[bytes]:
        """
        从缓存获取图片

        Args:
            encrypted_id: 加密的文件ID
            file_ext: 文件扩展名（含点号）

        Returns:
            图片字节数据，如果缓存不存在返回 None
        """
        cache_path = self._get_cache_path(encrypted_id, file_ext)
        
        if not cache_path.exists():
            return None

        try:
            with open(cache_path, 'rb') as f:
                data = f.read()
            logger.debug(f"缓存命中: {encrypted_id}")
            return data
        except Exception as e:
            logger.error(f"读取缓存失败: {encrypted_id}, error={e}")
            # 读取失败时删除损坏的缓存文件
            try:
                cache_path.unlink()
            except:
                pass
            return None

    def put(self, encrypted_id: str, file_content: bytes, file_ext: str = "") -> bool:
        """
        将图片写入缓存

        Args:
            encrypted_id: 加密的文件ID
            file_content: 图片字节数据
            file_ext: 文件扩展名（含点号）

        Returns:
            是否缓存成功
        """
        if not file_content:
            return False

        cache_path = self._get_cache_path(encrypted_id, file_ext)

        try:
            # 使用临时文件写入，避免写入过程中被读取
            temp_path = cache_path.with_suffix(cache_path.suffix + '.tmp')
            with open(temp_path, 'wb') as f:
                f.write(file_content)
            
            # 原子性重命名
            shutil.move(str(temp_path), str(cache_path))
            logger.info(f"缓存写入成功: {encrypted_id}, size={len(file_content)} bytes")
            return True
        except Exception as e:
            logger.error(f"缓存写入失败: {encrypted_id}, error={e}")
            # 清理临时文件
            try:
                temp_path = cache_path.with_suffix(cache_path.suffix + '.tmp')
                if temp_path.exists():
                    temp_path.unlink()
            except:
                pass
            return False

    def exists(self, encrypted_id: str, file_ext: str = "") -> bool:
        """
        检查缓存是否存在

        Args:
            encrypted_id: 加密的文件ID
            file_ext: 文件扩展名（含点号）

        Returns:
            缓存是否存在
        """
        cache_path = self._get_cache_path(encrypted_id, file_ext)
        return cache_path.exists()

    def delete(self, encrypted_id: str, file_ext: str = "") -> bool:
        """
        删除缓存文件

        Args:
            encrypted_id: 加密的文件ID
            file_ext: 文件扩展名（含点号）。如果为空，则匹配所有扩展名

        Returns:
            是否删除成功
        """
        # 如果提供了扩展名，直接删除指定文件
        if file_ext:
            cache_path = self._get_cache_path(encrypted_id, file_ext)
            if cache_path.exists():
                try:
                    cache_path.unlink()
                    logger.info(f"缓存删除成功: {encrypted_id}{file_ext}")
                    return True
                except Exception as e:
                    logger.error(f"缓存删除失败: {encrypted_id}{file_ext}, error={e}")
                    return False
            return True
        
        # 如果没有提供扩展名，查找并删除所有匹配的文件
        # 根据两级目录结构查找
        if len(encrypted_id) >= 4:
            level1 = encrypted_id[:2]
            level2 = encrypted_id[2:4]
            cache_subdir = self.cache_dir / level1 / level2
        else:
            cache_subdir = self.cache_dir / "misc"
        
        if not cache_subdir.exists():
            return True
        
        deleted = False
        try:
            # 查找所有以 encrypted_id 开头的文件
            for cache_file in cache_subdir.glob(f"{encrypted_id}*"):
                if cache_file.is_file():
                    try:
                        cache_file.unlink()
                        logger.info(f"缓存删除成功: {cache_file.name}")
                        deleted = True
                    except Exception as e:
                        logger.error(f"缓存删除失败: {cache_file.name}, error={e}")
            return deleted or True  # 没找到文件也算成功
        except Exception as e:
            logger.error(f"查找缓存文件失败: {encrypted_id}, error={e}")
            return False

    def get_cache_size(self) -> Tuple[int, int]:
        """
        获取缓存统计信息

        Returns:
            (文件数量, 总大小字节数)
        """
        total_size = 0
        file_count = 0

        try:
            for root, dirs, files in os.walk(self.cache_dir):
                for file in files:
                    if not file.endswith('.tmp'):
                        file_path = Path(root) / file
                        try:
                            total_size += file_path.stat().st_size
                            file_count += 1
                        except:
                            pass
        except Exception as e:
            logger.error(f"获取缓存统计失败: {e}")

        return file_count, total_size

    def clear_all(self) -> Tuple[int, int]:
        """
        清空所有缓存

        Returns:
            (删除的文件数, 释放的字节数)
        """
        deleted_count = 0
        freed_bytes = 0

        try:
            for root, dirs, files in os.walk(self.cache_dir):
                for file in files:
                    file_path = Path(root) / file
                    try:
                        size = file_path.stat().st_size
                        file_path.unlink()
                        deleted_count += 1
                        freed_bytes += size
                    except Exception as e:
                        logger.error(f"删除缓存文件失败: {file_path}, error={e}")
            
            logger.info(f"缓存清空完成: 删除 {deleted_count} 个文件, 释放 {freed_bytes} 字节")
        except Exception as e:
            logger.error(f"清空缓存失败: {e}")

        return deleted_count, freed_bytes


# 全局缓存服务实例
_cache_service: Optional[ImageCacheService] = None


def get_cache_service() -> ImageCacheService:
    """获取全局缓存服务实例"""
    global _cache_service
    if _cache_service is None:
        # 优先从数据库读取配置
        try:
            from ..database import get_system_setting
            cache_path_suffix = str(get_system_setting('local_cache_path') or '').strip()
            base_dir = os.getenv("IMAGE_CACHE_DIR", "/app/image")
            
            # 如果配置了相对路径，拼接到基础路径
            if cache_path_suffix and cache_path_suffix.startswith('/'):
                cache_dir = base_dir + cache_path_suffix
            else:
                cache_dir = base_dir
        except Exception as e:
            logger.warning(f"读取缓存配置失败，使用默认值: {e}")
            cache_dir = os.getenv("IMAGE_CACHE_DIR", "/app/image")
        
        _cache_service = ImageCacheService(cache_dir=cache_dir)
    return _cache_service


__all__ = ["ImageCacheService", "get_cache_service"]

#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""临时脚本：检查数据库中的token数据"""
import sqlite3
import sys

# 尝试多个可能的数据库路径
db_paths = [
    'telegram_imagebed.db',
    'data/telegram_imagebed.db',
    'imagebed.db',
    'data/imagebed.db',
]

conn = None
for db_path in db_paths:
    try:
        conn = sqlite3.connect(db_path)
        print(f"✓ 成功连接数据库: {db_path}\n")
        break
    except:
        continue

if not conn:
    print("✗ 错误：找不到数据库文件")
    print("请将 telegram_imagebed.db 文件放在以下任一位置：")
    for path in db_paths:
        print(f"  - {path}")
    sys.exit(1)
cursor = conn.cursor()

print("=" * 80)
print("最近5条上传记录：")
print("=" * 80)

cursor.execute("""
    SELECT encrypted_id, original_filename, auth_token, created_at
    FROM file_storage
    ORDER BY created_at DESC
    LIMIT 5
""")

for row in cursor.fetchall():
    encrypted_id, filename, auth_token, created_at = row
    token_display = auth_token[:30] + '...' if auth_token else 'NULL'
    print(f"\n文件ID: {encrypted_id}")
    print(f"文件名: {filename}")
    print(f"Token: {token_display}")
    print(f"时间: {created_at}")

print("\n" + "=" * 80)
print("查询特定token的上传记录：")
print("=" * 80)

target_token = "guest_5e6bcf0188fc7d862306fbe1f79ded358a0f57e6d83d75bd8dd3c7b53f198c4d"
cursor.execute("""
    SELECT COUNT(*), GROUP_CONCAT(encrypted_id, ', ')
    FROM file_storage
    WHERE auth_token = ?
""", (target_token,))

count, ids = cursor.fetchone()
print(f"\nToken: {target_token[:30]}...")
print(f"找到记录数: {count}")
if ids:
    print(f"文件IDs: {ids}")

conn.close()

#!/usr/bin/env python3
import sqlite3

conn = sqlite3.connect('../telegram_imagebed.db')
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
    token_display = (auth_token[:30] + '...') if auth_token else 'NULL'
    print(f"\n文件ID: {encrypted_id}")
    print(f"文件名: {filename}")
    print(f"Token: {token_display}")
    print(f"时间: {created_at}")

print("\n" + "=" * 80)
print("查询特定token的上传记录：")
print("=" * 80)

target_token = "guest_5e6bcf0188fc7d862306fbe1f79ded358a0f57e6d83d75bd8dd3c7b53f198c4d"
cursor.execute("""
    SELECT COUNT(*) FROM file_storage WHERE auth_token = ?
""", (target_token,))

count = cursor.fetchone()[0]
print(f"\nToken: {target_token[:30]}...")
print(f"找到记录数: {count}")

if count > 0:
    cursor.execute("""
        SELECT encrypted_id, original_filename, created_at
        FROM file_storage
        WHERE auth_token = ?
        ORDER BY created_at DESC
    """, (target_token,))
    print("\n图片列表：")
    for row in cursor.fetchall():
        print(f"  - {row[0]} | {row[1]} | {row[2]}")

conn.close()

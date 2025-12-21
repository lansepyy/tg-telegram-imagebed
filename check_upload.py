#!/usr/bin/env python3
import sqlite3

conn = sqlite3.connect('../telegram_imagebed.db')
cursor = conn.cursor()

encrypted_id = 'c109d76df54a90df350e29aedba1f9dc'

cursor.execute("""
    SELECT encrypted_id, original_filename, auth_token, source, created_at
    FROM file_storage
    WHERE encrypted_id = ?
""", (encrypted_id,))

row = cursor.fetchone()
if row:
    print(f"文件ID: {row[0]}")
    print(f"文件名: {row[1]}")
    print(f"Token: {row[2] if row[2] else 'NULL'}")
    print(f"来源: {row[3]}")
    print(f"时间: {row[4]}")
else:
    print("找不到该文件")

conn.close()

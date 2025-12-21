#!/usr/bin/env python3
import sqlite3

conn = sqlite3.connect('../telegram_imagebed.db')
cursor = conn.cursor()

print("数据库中的所有表：")
cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
for table in cursor.fetchall():
    print(f"  {table[0]}")

conn.close()

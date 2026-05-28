import sqlite3
import datetime

conn = sqlite3.connect('db.sqlite3')
cursor = conn.cursor()
try:
    cursor.execute("INSERT INTO django_migrations (app, name, applied) VALUES (?, ?, ?)", 
                   ('users', '0001_initial', datetime.datetime.now()))
    conn.commit()
    print("Successfully marked users.0001_initial as applied")
except Exception as e:
    print(f"Error: {e}")
finally:
    conn.close()

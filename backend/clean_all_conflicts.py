import sqlite3
import datetime

conn = sqlite3.connect('db.sqlite3')
cursor = conn.cursor()

# Lista de migraciones que causan conflictos de dependencia
apps_to_clean = ['account', 'socialaccount', 'dj_rest_auth', 'authtoken', 'admin']

try:
    for app in apps_to_clean:
        cursor.execute("DELETE FROM django_migrations WHERE app = ?", (app,))
        print(f"Removed all migration records for {app}")
    conn.commit()
    print("Successfully cleaned migration history for conflicting apps.")
except Exception as e:
    print(f"Error: {e}")
finally:
    conn.close()

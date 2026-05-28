import sqlite3
import datetime

conn = sqlite3.connect('db.sqlite3')
cursor = conn.cursor()

# Lista de migraciones a eliminar de la tabla django_migrations para forzar reaplicación
migrations_to_remove = [
    ('users', '0001_initial'),
    ('users', '0002_passwordresettoken')
]

try:
    for app, name in migrations_to_remove:
        cursor.execute("DELETE FROM django_migrations WHERE app = ? AND name = ?", (app, name))
        print(f"Removed migration record for {app}.{name}")
    conn.commit()
    print("Successfully cleaned migration history for 'users' app.")
except Exception as e:
    print(f"Error: {e}")
finally:
    conn.close()

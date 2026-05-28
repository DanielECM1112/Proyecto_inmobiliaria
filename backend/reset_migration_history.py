import sqlite3

conn = sqlite3.connect('db.sqlite3')
cursor = conn.cursor()

# Limpiar TODO el historial de migraciones para forzar un estado limpio
try:
    cursor.execute("DELETE FROM django_migrations")
    print(f"Removed {cursor.rowcount} migration records. History is now empty.")
    conn.commit()
except Exception as e:
    print(f"Error: {e}")
finally:
    conn.close()

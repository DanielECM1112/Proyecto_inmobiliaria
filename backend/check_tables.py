import sqlite3

conn = sqlite3.connect('db.sqlite3')
cursor = conn.cursor()

# Lista de tablas para verificar
tables = ['users_usuario', 'auth_user', 'plans_plan']

for table in tables:
    cursor.execute(f"SELECT name FROM sqlite_master WHERE type='table' AND name='{table}';")
    result = cursor.fetchone()
    if result:
        print(f"Table '{table}' exists.")
        # Verificamos columnas si existe
        cursor.execute(f"PRAGMA table_info({table})")
        cols = [col[1] for col in cursor.fetchall()]
        print(f"Columns in '{table}': {cols}")
    else:
        print(f"Table '{table}' DOES NOT exist.")
    print("-" * 20)

conn.close()

import sqlite3

conn = sqlite3.connect('db.sqlite3')
cursor = conn.cursor()

# SQL para crear la tabla users_usuario manualmente si no existe
create_table_sql = """
CREATE TABLE IF NOT EXISTS "users_usuario" (
    "password" varchar(128) NOT NULL,
    "last_login" datetime NULL,
    "is_superuser" bool NOT NULL,
    "id" char(32) NOT NULL PRIMARY KEY,
    "nombre" varchar(255) NOT NULL,
    "email" varchar(254) NOT NULL UNIQUE,
    "rol" varchar(10) NOT NULL,
    "is_active" bool NOT NULL,
    "is_staff" bool NOT NULL,
    "created_at" datetime NOT NULL,
    "updated_at" datetime NOT NULL
);
"""

try:
    cursor.execute(create_table_sql)
    print("Table 'users_usuario' created or already exists.")
    conn.commit()
except Exception as e:
    print(f"Error creating table: {e}")
finally:
    conn.close()

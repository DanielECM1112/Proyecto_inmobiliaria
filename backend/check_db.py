import sqlite3

conn = sqlite3.connect('db.sqlite3')
cursor = conn.cursor()
cursor.execute("PRAGMA table_info(plans_plan)")
columns = cursor.fetchall()
print("Columns in plans_plan table:")
for col in columns:
    print(f"- {col[1]}")
conn.close()

import sqlite3
p='backend/db.sqlite3'
conn=sqlite3.connect(p)
cur=conn.cursor()
for t in ('payments_pago','properties_inmueble'):
    try:
        print('---', t, '---')
        info = cur.execute("PRAGMA table_info('%s')"%t).fetchall()
        for row in info:
            print(row)
    except Exception as e:
        print('error for', t, e)
conn.close()

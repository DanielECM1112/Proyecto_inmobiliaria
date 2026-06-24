import sqlite3, json
p='backend/db.sqlite3'
conn=sqlite3.connect(p)
cur=conn.cursor()
cur.execute("SELECT name FROM sqlite_master WHERE type='table'")
tables=[r[0] for r in cur.fetchall()]
refs=[]
for t in tables:
    try:
        cur.execute("PRAGMA foreign_key_list('%s')" % t)
        fks=cur.fetchall()
        for fk in fks:
            if fk[2]=='plans_plan':
                refs.append({'table':t, 'fk':fk})
    except Exception as e:
        pass
print(json.dumps(refs, indent=2))
conn.close()

import psycopg2
import os
from dotenv import load_dotenv

load_dotenv('.env')

try:
    conn = psycopg2.connect(
        host=os.getenv('DB_HOST'),
        user=os.getenv('DB_USER'),
        password=os.getenv('DB_PASSWORD'),
        dbname=os.getenv('DB_NAME'),
        port=os.getenv('DB_PORT')
    )
    cur = conn.cursor()
    cur.execute("SELECT column_name FROM information_schema.columns WHERE table_name='users';")
    print("Columns:", [row[0] for row in cur.fetchall()])
except Exception as e:
    print("Error:", e)

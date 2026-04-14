import os
from dotenv import load_dotenv
import psycopg2
from psycopg2 import pool
from psycopg2.extras import RealDictCursor

load_dotenv()

# ─── Connection Pool ─────────────────────────────────────────

db_pool = None


def connect_db():
    """Create the sync connection pool on startup."""
    global db_pool
    try:
        db_pool = psycopg2.pool.ThreadedConnectionPool(
            1, 10,
            host=os.getenv("DB_HOST", "localhost"),
            port=os.getenv("DB_PORT", "5432"),
            user=os.getenv("DB_USER", "postgres"),
            password=os.getenv("DB_PASSWORD", ""),
            dbname=os.getenv("DB_NAME", "Gaura_db"),
            sslmode=os.getenv("DB_SSLMODE", "require")
        )
        if db_pool:
            print("✅ Connected to PostgreSQL")
    except (Exception, psycopg2.DatabaseError) as error:
        print("Error connecting to PostgreSQL:", error)


def disconnect_db():
    """Close the pool on shutdown."""
    global db_pool
    if db_pool:
        db_pool.closeall()
        print("🔌 PostgreSQL pool closed")


def get_db():
    """FastAPI dependency – yields a connection and cursor from the pool."""
    conn = db_pool.getconn()
    try:
        # Use RealDictCursor to return dicts instead of tuples like Express did
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            yield cur
        conn.commit()
    except Exception as e:
        conn.rollback()
        raise e
    finally:
        db_pool.putconn(conn)

import pg from 'pg';
// load .env
import dotenv from 'dotenv';

const { Pool } = pg;
dotenv.config();

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'ieeecs',
  password: process.env.DB_PASSWORD,
  port: 5432,
});

export default pool;

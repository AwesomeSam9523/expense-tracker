import pg from 'pg';
// load .env
import dotenv from 'dotenv';

const { Pool } = pg;
dotenv.config();

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DATABASE,
  password: process.env.POSTGRES_PASSWORD,
  port: 5432,
  ssl: true,
});

export default pool;

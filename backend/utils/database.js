import pg from "pg";
const { Pool } = pg;
// load .env
import dotenv from "dotenv";
dotenv.config();

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'ieeecs',
    password: process.env.DB_PASSWORD,
    port: 5432,
});

export default pool;

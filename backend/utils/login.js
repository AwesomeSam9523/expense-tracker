import pool from './database.js';

const tokenMap = {};

export async function getUser(token) {
    if (tokenMap[token]) {
        return tokenMap[token];
    }

    const data = await pool.query(`SELECT "id", "name", "pfp", "role" FROM "users" WHERE "token" = $1`, [token]);
    if (data.rowCount === 0) {
        return null;
    }

    const user = data.rows[0];
    tokenMap[token] = {
        id: user.id,
        name: user.name,
        pfp: user.pfp,
        role: user.role,
    };

    return tokenMap[token];
}

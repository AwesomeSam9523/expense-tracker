import pool from './database.js';

const tokenMap = {};

async function getUser(token) {
  const data = await pool.query('SELECT "id", "name", "pfp", "role", "enabled", "firstLogin" FROM "public"."users" WHERE "token" = $1 AND "deleted" = false', [token]);
  if (data.rowCount === 0) {
    return null;
  }

  const user = data.rows[0];
  if (!user.enabled) {
    return null;
  }

  tokenMap[token] = {
    id: user.id,
    name: user.name,
    pfp: user.pfp,
    role: user.role,
    firstLogin: user.firstLogin,
  };

  return tokenMap[token];
}

export default getUser;

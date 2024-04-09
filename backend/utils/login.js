import pool from './database';

const tokenMap = {};

async function getUser(token) {
  if (tokenMap[token]) {
    return tokenMap[token];
  }

  const data = await pool.query('SELECT "id", "name", "pfp", "role", "enabled" FROM "users" WHERE "token" = $1', [token]);
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
  };

  return tokenMap[token];
}

export default getUser;

import { createHash } from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

function hashPassword(password) {
  return Buffer.from(createHash('sha256').update(password + process.env.PASSWORD_SALT).digest('hex')).toString('base64');
}

export default hashPassword;

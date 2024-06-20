import bcrypt from 'bcryptjs';

function hashPassword(password) {
  return bcrypt.hashSync(password, process.env.PASSWORD_SALT)
}

export default hashPassword;

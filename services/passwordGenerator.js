const bcrypt = require('bcryptjs');

const defaultSalt = 10;

const hashedPassword = async (password) => {
  const salt = await bcrypt.genSalt(defaultSalt);
  const passwordHash = await bcrypt.hash(password, salt);
  return passwordHash;
};

module.exports = hashedPassword;
const bcrypt = require("bcryptjs");

module.exports = {
  hash: (password) => bcrypt.hashSync(password, 10),
  compare: (password, hash) => bcrypt.compareSync(password, hash)
};

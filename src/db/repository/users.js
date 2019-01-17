const { Users } = require('../../db');

const create = (no, id, nickname, transaction) => {
  return Users.create(
    {
      no,
      nickname,
      id,
    },
    { transaction },
  );
};

module.exports = {
  create,
};

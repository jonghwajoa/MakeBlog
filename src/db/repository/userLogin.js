const { UserLogin } = require('../../db');

const create = (id, pw, transaction) => {
  return UserLogin.create(
    {
      id,
      hash: pw,
    },
    { transaction },
  );
};

const findById = id => {
  return UserLogin.findOne({
    where: {
      id,
    },
  });
};

module.exports = {
  create,
  findById,
};

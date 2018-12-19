const { UserLogin } = require('../../db');

create = (id, pw, transaction) => {
  return UserLogin.create(
    {
      id,
      hash: pw,
    },
    { transaction },
  );
};

findById = id => {
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

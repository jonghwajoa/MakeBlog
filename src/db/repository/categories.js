const { Categories } = require('../../db');

const findAll = () => {
  return Categories.findAll({});
};

const create = explain => {
  return Categories.create({
    explain,
  });
};

const findOrCreate = explain => {
  return Categories.findOrCreate({ where: { explain } });
};

const find = explain => {
  return Categories.findOne({
    where: { explain },
  });
};

module.exports = {
  find,
  findAll,
  create,
  findOrCreate,
};

const { Categories } = require('../../db');

const findAll = () => {
  return Categories.findAll({});
};

module.exports = {
  findAll,
};

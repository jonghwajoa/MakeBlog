const { CategoriesCote } = require('../../db');

const findAllList = () => {
  return CategoriesCote.findAll({
    order: [['order']],
  });
};

module.exports = {
  findAllList,
};

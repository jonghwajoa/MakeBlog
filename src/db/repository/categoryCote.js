const { CategoryCote } = require('../../db');

const findAllList = () => {
  return CategoryCote.findAll({
    order: [['order']],
  });
};

const findById = id => {
  return CategoryCote.findById(id);
};

module.exports = {
  findAllList,
  findById,
};

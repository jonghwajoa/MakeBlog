const { CategoryCote, Solving } = require('../../db');

const findAllList = () => {
  return CategoryCote.findAll({
    order: [['order']],
    include: [
      {
        model: Solving,
        attributes: ['no', 'problemNum'],
      },
    ],
  });
};

const findById = id => {
  return CategoryCote.findById(id);
};

module.exports = {
  findAllList,
  findById,
};

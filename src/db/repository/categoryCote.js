const { CategoryCote, Solving } = require('../../db');

const findAllList = () => {
  return CategoryCote.findAll({
    order: [['order']],
    include: [
      {
        model: Solving,
        attributes: ['problemNum'],
        order: [[CategoryCote.sequelize.fn('length', CategoryCote.sequelize.col('problemNum'))]],
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

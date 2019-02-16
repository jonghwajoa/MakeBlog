const { CategoryCote, Solving } = require('../../db');

const findAllList = () => {
  return CategoryCote.findAll({
    order: [['order']],
    include: [
      {
        model: Solving,
        attributes: ['problemNum'],
      },
    ],
  });
};

const findById = id => {
  return CategoryCote.findById(id);
};

const findByName = name => {
  return CategoryCote.findOne({
    where: {
      title: name,
    },
  });
};

const create = (title, order) => {
  return CategoryCote.create({
    title,
    order,
  });
};

const findNextOrder = () => {
  return CategoryCote.max('order');
};

module.exports = {
  findAllList,
  findById,
  findByName,
  findNextOrder,
  create,
};

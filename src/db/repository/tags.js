const { Tags } = require('../../db');

const findAll = () => {
  return Tags.findAll();
};

const findByName = name => {
  return Tags.findOne({
    where: {
      name,
    },
  });
};

const findById = id => {
  return Tags.findById(id);
};

const create = name => {
  return Tags.create({
    name,
  });
};

module.exports = {
  findAll,
  findByName,
  create,
  findById,
};

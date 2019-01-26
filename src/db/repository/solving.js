const { Solving } = require('../../db');

const create = ({ title, resource, content, category }, writer) => {
  return Solving.create({
    title,
    resource,
    content,
    category_cote_no: category,
    writer,
  });
};

module.exports = {
  create,
};

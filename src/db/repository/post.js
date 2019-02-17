const { Posts } = require('../../db');

const findTransactionById = (id, transaction) => {
  return Posts.findById(id, { transaction });
};

const findByCategoryId = id => {
  return Posts.findOne({
    where: {
      category_no: id,
    },
  });
};

/**
 * @deprecated
 * use instance destroy instead of this function
 */
const deleteById = id => {
  return Posts.destroy({
    where: {
      no: id,
    },
  });
};

const updateById = (id, title, content, categories) => {
  return Posts.update(
    {
      title,
      content,
      categories,
    },
    { where: { no: id } },
  );
};

module.exports = {
  deleteById,
  updateById,
  findTransactionById,
  findByCategoryId,
};

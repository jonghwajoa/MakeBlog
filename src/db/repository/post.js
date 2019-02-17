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

const findAll = (pageNum = 10, offset = 0) => {
  return Posts.findAll({
    limit: pageNum,
    offset,
    attributes: [
      'no',
      'title',
      'count',
      [Posts.sequelize.fn('date_format', Posts.sequelize.col('created_at'), '%Y.%m.%d'), 'created_at'],
    ],
    order: [['created_at', 'DESC']],
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
  findAll,
  updateById,
  findTransactionById,
  findByCategoryId,
};

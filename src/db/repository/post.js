const { Posts } = require('../../db');

const findById = id => {
  return Posts.findById(id, {
    attributes: ['no', 'title', 'tag', 'content', 'category_no'],
  });
};

const findTransactionById = (id, transaction) => {
  return Posts.findById(id, { transaction });
};

const findHotPost = () => {
  return Posts.findAll({
    limit: 5,
    attributes: ['no', 'title'],
    order: [['count', 'desc']],
  });
};

const findAllList = (pageNum = 10, offset = 0) => {
  return Posts.findAll({
    limit: pageNum,
    offset,
    attributes: [
      'no',
      'title',
      'tag',
      'count',
      [
        Posts.sequelize.fn(
          'date_format',
          Posts.sequelize.col('created_at'),
          '%Y.%m.%d',
        ),
        'created_at',
      ],
    ],
    order: [['created_at', 'DESC']],
  });
};

const creatPost = ({ title, tag, content, category }, writer) => {
  return Posts.create({
    title,
    tag,
    content,
    category_no: category,
    writer,
  });
};

const postFindById = id => {
  return Posts.findById(id, {
    attributes: [
      'no',
      'title',
      'tag',
      'content',
      'count',
      [
        Posts.sequelize.fn(
          'date_format',
          Posts.sequelize.col('created_at'),
          '%Y-%m-%d',
        ),
        'created_at',
      ],
    ],
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

const totalCount = () => {
  return Posts.count();
};

module.exports = {
  findById,
  postFindById,
  deleteById,
  findAllList,
  creatPost,
  updateById,
  totalCount,
  findHotPost,
  findTransactionById,
};

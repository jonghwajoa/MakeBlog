const { SubPosts } = require('../../db');

create = (postNo, { title, content }) => {
  return SubPosts.create({
    title,
    content,
    post_no: postNo,
  });
};

findById = id => {
  return SubPosts.findById(id);
};

findHotPost = () => {
  return SubPosts.findAll({
    limit: 5,
    attributes: ['no', 'title', 'post_no'],
    order: [['count', 'desc']],
  });
};

findByPostNo = id => {
  return SubPosts.findAll({
    where: {
      post_no: id,
    },
    attributes: ['no', 'title'],
  });
};

findDetailByPostNo = id => {
  return SubPosts.findById(id, {
    attributes: [
      'no',
      'title',
      'content',
      'count',
      [
        SubPosts.sequelize.fn(
          'date_format',
          SubPosts.sequelize.col('created_at'),
          '%Y.%m.%d',
        ),
        'created_at',
      ],
    ],
  });
};

module.exports = {
  create,
  findByPostNo,
  findDetailByPostNo,
  findHotPost,
  findById,
};

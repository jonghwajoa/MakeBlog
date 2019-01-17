const { SubPosts } = require('../../db');

const create = (postNo, { title, content }, sub_no) => {
  return SubPosts.create({
    title,
    content,
    post_no: postNo,
    sub_no,
  });
};

const findById = id => {
  return SubPosts.findById(id);
};

const findHotPost = () => {
  return SubPosts.findAll({
    limit: 5,
    attributes: ['no', 'title', 'post_no'],
    order: [['count', 'desc']],
  });
};

const findByPostNo = id => {
  return SubPosts.findAll({
    where: {
      post_no: id,
    },
    attributes: ['title', 'sub_no'],
  });
};

const findDetailByPostNo = (postId, subId) => {
  return SubPosts.findOne({
    where: { post_no: postId, sub_no: subId },
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

const findNextNo = postNo => {
  return SubPosts.max('sub_no', {
    where: {
      post_no: postNo,
    },
  });
};

module.exports = {
  create,
  findByPostNo,
  findDetailByPostNo,
  findHotPost,
  findById,
  findNextNo,
};

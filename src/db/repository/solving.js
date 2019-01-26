const { Solving } = require('../../db');

const create = ({ title, url, problemNum, content, category }, writer) => {
  return Solving.create({
    title,
    url,
    problemNum,
    content,
    category_cote_no: category,
    writer,
  });
};

const findById = id => {
  return Solving.findById(1, {
    attributes: [
      'no',
      'title',
      'content',
      'count',
      'problemNum',
      'url',
      [
        Solving.sequelize.fn(
          'date_format',
          Solving.sequelize.col('created_at'),
          '%Y-%m-%d',
        ),
        'created_at',
      ],
    ],
  });
};

const findByProblemNum = problemNum => {
  return Solving.findOne({
    where: { problemNum },
    attributes: [
      'no',
      'title',
      'content',
      'count',
      'problemNum',
      'category_cote_no',
      'url',
      [
        Solving.sequelize.fn(
          'date_format',
          Solving.sequelize.col('created_at'),
          '%Y-%m-%d',
        ),
        'created_at',
      ],
    ],
  });
};

module.exports = {
  create,
  findById,
  findByProblemNum,
};

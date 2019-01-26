const { Solving } = require('../../db');

const create = ({ title, url, problemNum, content, category }, writer) => {
  return Solving.create({
    problemNum,
    title,
    url,
    content,
    category_cote_no: category,
    writer,
  });
};

const findById = id => {
  return Solving.findById(id, {
    attributes: [
      'problemNum',
      'title',
      'content',
      'count',
      'url',
      'category_cote_no',
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
};

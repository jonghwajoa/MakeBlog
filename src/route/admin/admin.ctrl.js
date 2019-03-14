const db = require('../../db');

const index = async (req, res, next) => {
  let result;
  try {
    result = await db.VisitCount.findAll({
      where: {
        year: 2019,
        month: 3,
      },
      attributes: ['day', 'count'],
    });
  } catch (e) {
    next(e);
  }

  return res.render('team/admin/index', { result });
};

module.exports = {
  index,
};

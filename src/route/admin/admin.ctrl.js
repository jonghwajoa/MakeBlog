const db = require('../../db');

const index = async (req, res, next) => res.render('team/admin/index');
const errorPage = async (req, res, next) => {
  let result;
  try {
    result = await db.ErrorLog.findAllWithPaging();
  } catch (e) {
    next(e);
  }

  return res.render('team/admin/error', { data: result });
};

module.exports = {
  index,
  errorPage,
};

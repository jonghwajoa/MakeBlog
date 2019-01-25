const Categories = require('../../db/repository/categoriesCote');

const list = async (req, res, next) => {
  let result;
  try {
    result = await Categories.findAllList();
  } catch (e) {
    return next(e);
  }

  return res.render('team/solving/list', { category: result });
};

const createView = async (req, res) => {
  let result;
  try {
    result = await Categories.findAllList();
  } catch (e) {
    return next(e);
  }
  return res.render('team/solving/new', { category: result });
};

module.exports = {
  list,
  createView,
};

const Categories = require('../../db/repository/categoriesCote');

const list = async (req, res, next) => {
  let result;
  try {
    result = await Categories.findAllList();
  } catch (e) {
    return next(e);
  }

  return res.render('noauth/solving/list', { categories: result });
};

module.exports = {
  list,
};

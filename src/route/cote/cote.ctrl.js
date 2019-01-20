const Categories = require('../../db/repository/categoriesCote');

list = async (req, res, next) => {
  let result;
  try {
    result = await Categories.findAllList();
  } catch (e) {
    console.log(e);
    return next(e);
  }

  console.log(result);
  return res.render('noauth/cote/list', { categories: result });
};

module.exports = {
  list,
};

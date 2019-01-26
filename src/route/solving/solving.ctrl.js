const CategoryDB = require('../../db/repository/categoryCote');
const SolvingDB = require('../../db/repository/solving');
const { solvingValidation } = require('../../lib/validation');

const list = async (req, res, next) => {
  let result;
  try {
    result = await CategoryDB.findAllList();
  } catch (e) {
    return next(e);
  }

  return res.render('team/solving/list', { category: result });
};

const createView = async (req, res) => {
  let result;
  try {
    result = await CategoryDB.findAllList();
  } catch (e) {
    return next(e);
  }
  return res.render('team/solving/new', { category: result });
};

const create = async (req, res, next) => {
  const { title, content, category, resource } = req.body;
  let result;
  if (!solvingValidation(req.body)) {
    return res.status(400).json({ messege: 'Null값이 존재하면 안됩니다.' });
  }

  try {
    result = await CategoryDB.findById(category);
  } catch (e) {
    next(e);
  }

  if (!result) {
    return res.status(400).json({ message: '잘못된 요청입니다.' });
  }

  try {
    //req.session.userid
    result = await SolvingDB.create(req.body, 1);
  } catch (e) {
    next(e);
  }

  return res.status(201).json({ no: result.dataValues.no });
};

module.exports = {
  list,
  createView,
  create,
};

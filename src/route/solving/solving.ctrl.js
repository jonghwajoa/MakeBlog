const CategoryDB = require('../../db/repository/categoryCote');
const SolvingDB = require('../../db/repository/solving');
const { solvingValidation } = require('../../lib/validation');
const db = require('../../db');

const list = async (req, res, next) => {
  let categoryResult;
  let homePost;

  try {
    categoryResult = await CategoryDB.findAllList();
    homePost = await SolvingDB.findById(1);
  } catch (e) {
    return next(e);
  }

  let path = 'noauth/solving/list';
  if (req.session.isLogin) {
    path = 'team/solving/list';
  }

  return res.render(path, {
    category: categoryResult,
    post: homePost,
  });
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
  const { title, content, category, url, problemNum } = req.body;
  let categoryResult;

  if (!solvingValidation(req.body)) {
    return res.status(400).json({ messege: 'Null값이 존재하면 안됩니다.' });
  }

  try {
    categoryResult = await CategoryDB.findById(category);
    let result = await SolvingDB.findById(problemNum);
    if (result) {
      return res.status(400).json({ message: '이미 작성한 문제입니다.' });
    }
  } catch (e) {
    next(e);
  }

  if (!categoryResult) {
    return res.status(400).json({ message: '잘못된 요청입니다.' });
  }

  try {
    //req.session.userid
    await SolvingDB.create(req.body, 1);
  } catch (e) {
    next(e);
  }

  return res.status(204).end();
};

const show = async (req, res, next) => {
  let { id } = req.params;
  let postResult;

  try {
    postResult = await SolvingDB.findById(id);
    if (!postResult) {
      return next();
    }
    postResult.updateAttributes({
      count: postResult.dataValues.count + 1,
    });
  } catch (e) {
    return next(e);
  }

  if (req.headers['content-type'] === 'application/json') {
    return res.json(postResult);
  }

  let categoryResult;
  try {
    categoryResult = await CategoryDB.findAllList();
  } catch (e) {
    return next(e);
  }

  let path = 'noauth/solving/list';
  if (req.session.isLogin) {
    path = 'team/solving/list';
  }

  return res.render(path, {
    category: categoryResult,
    post: postResult,
  });
};

const updateView = async (req, res, next) => {
  let { id } = req.params;
  let postResult, categoryResult;
  try {
    categoryResult = await CategoryDB.findAllList();
    postResult = await SolvingDB.findById(id);
  } catch (e) {
    next(e);
  }

  if (!postResult) {
    next();
  }

  return res.render('team/solving/update', {
    category: categoryResult,
    post: postResult,
  });
};

const update = async (req, res, next) => {
  let { title, content, category, url, problemNum } = req.body;
  if (!solvingValidation(req.body)) {
    return res.status(400).json({ messege: 'Null값이 존재하면 안됩니다.' });
  }

  const updateVal = { title, content, category_cote_no: category, url };
  try {
    let solvingResult = await SolvingDB.findById(problemNum);
    if (!solvingResult) next(e);
    let categoryResult = await CategoryDB.findById(category);

    if (!categoryResult) {
      return res.status(400).json({ message: '없는 카테고리 입니다..' });
    }
    await solvingResult.update(updateVal);
  } catch (e) {
    next(e);
  }

  return res.status(204).end();
};

const remove = async (req, res, next) => {
  const { id } = req.params;
  try {
    let solvingResult = await SolvingDB.findById(id);
    if (!solvingResult) next();

    await solvingResult.destroy();
    return res.status(204).end();
  } catch (e) {
    return next(e);
  }
};

module.exports = {
  list,
  createView,
  create,
  show,
  updateView,
  update,
  remove,
};

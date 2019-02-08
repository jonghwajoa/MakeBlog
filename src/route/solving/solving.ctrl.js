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

  let createResult;
  try {
    //req.session.userid
    createResult = await SolvingDB.create(req.body, 1);
  } catch (e) {
    next(e);
  }
  return res.status(201).json({ no: createResult.dataValues.problemNum });
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

  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
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

const addCategory = async (req, res, next) => {
  const { requestCategoryName } = req.body;
  let categoryResult;

  if (!requestCategoryName) {
    return res.status(400).end();
  }

  try {
    categoryResult = await CategoryDB.findByName(requestCategoryName);
    if (categoryResult !== null) {
      return res.status(400).json('이미 존재하는 카테고리 입니다.');
    }
    let nextOrder = await CategoryDB.findNextOrder();
    categoryResult = await CategoryDB.create(requestCategoryName, nextOrder + 1);
  } catch (e) {
    e.message = '카테고리 추가 실패';
    return next(e);
  }

  return res.status(201).json({
    message: '카테고리 추가 성공',
    no: categoryResult.dataValues.no,
  });
};

const removeCategory = async (req, res, next) => {
  let { id } = req.params;

  let categoryResult, solvingResult;

  try {
    categoryResult = await CategoryDB.findById(id);
    if (!categoryResult) {
      return res.status(404).json({ message: '없는 카테고리 입니다.' });
    }

    solvingResult = await SolvingDB.findByCategoryId(id);
    if (solvingResult) {
      return res.status(409).json({ message: '사용중인 카테고리는 삭제할 수 없습니다.' });
    }

    await categoryResult.destroy();
  } catch (e) {
    return next(e);
  }

  return res.status(204).end();
};

module.exports = {
  list,
  createView,
  create,
  show,
  updateView,
  update,
  remove,
  addCategory,
  removeCategory,
};

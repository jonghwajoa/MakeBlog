const postDB = require('../../db/repository/post');
const subPostDB = require('../../db/repository/subPost');
const libPost = require('../../lib/validation/post');
const visitDB = require('../../db/repository/visitCount');
const categoryDB = require('../../db/repository/categories');

const createView = async (req, res) => {
  try {
    const category = await categoryDB.findAll();
    return res.render('team/postWrite', { category });
  } catch (e) {
    next(e);
  }
};

const createSubView = (req, res) => {
  return res.render('team/subPostWrite', { no: req.params.id });
};

const create = async (req, res, next) => {
  if (!libPost.postValidation(req.body)) {
    return res.status(400).json('입력이 올바르지 않습니다.');
  }

  try {
    let result = await postDB.creatPost(req.body, req.session.userid);
    return res.status(201).json(result);
  } catch (e) {
    return next(e);
  }
};

const createSubPost = async (req, res, next) => {
  let id = req.params.id;
  if (!libPost.subPostValidation(req.body)) {
    return res.status(400).json('입력이 올바르지 않습니다.');
  }

  try {
    let nextNo = await subPostDB.findNextNo(id);
    nextNo = isNaN(nextNo) ? 2 : nextNo + 1;
    let result = await subPostDB.create(id, req.body, nextNo);
    return res.status(201).json(result);
  } catch (e) {
    return next(e);
  }
};

const list = async (req, res, next) => {
  let postList, totalCnt, pagingInfo;
  let hotPost, hotSubPost, monthCount, totalCount;

  try {
    [totalCnt, hotPost, hotSubPost, monthCount, totalCount] = await Promise.all(
      [
        postDB.totalCount(),
        postDB.findHotPost(),
        subPostDB.findHotPost(),
        visitDB.findMonthCount(req.year, req.month),
        visitDB.findToalCount(),
      ],
    );
  } catch (e) {
    return next(e);
  }

  pagingInfo = libPost.paging(totalCnt, req.query);
  const offset = (pagingInfo.page - 1) * pagingInfo.perPageNum;
  try {
    postList = await postDB.findAllList(pagingInfo.perPageNum, offset);
  } catch (e) {
    return next(e);
  }

  if (req.session.isLogin)
    return res.render('team/postList', {
      postList,
      pagingInfo,
      hotPost,
      hotSubPost,
      today: req.today,
      monthCount,
      totalCount,
    });

  return res.render('noauth/postList', {
    postList,
    pagingInfo,
    hotPost,
    hotSubPost,
    today: req.today,
    monthCount,
    totalCount,
  });
};

const show = async (req, res, next) => {
  const id = req.params.id;
  let post, subPost;

  try {
    post = await postDB.postFindById(id);
    if (!post) return next();
    subPost = await subPostDB.findByPostNo(id);
    post.updateAttributes({ count: post.dataValues.count + 1 });
  } catch (e) {
    return next(e);
  }

  if (req.session.isLogin)
    return res.render('team/postRead', { post, subPost });
  return res.render('noauth/postRead', { post, subPost });
};

const showSubPost = async (req, res, next) => {
  const { id, subId } = req.params;

  if (subId == 1) {
    return show(req, res, next);
  }
  let post, subPost;
  try {
    post = await subPostDB.findDetailByPostNo(id, subId);
    if (!post) return next();
    post.updateAttributes({ count: post.dataValues.count + 1 });
    subPost = await subPostDB.findByPostNo(id, subId);
  } catch (e) {
    return next(e);
  }

  if (req.headers['content-type'] === 'application/json') {
    return res.json({ post });
  }

  if (req.session.isLogin)
    return res.render('team/subPostRead', { post, subPost, home: id });
  return res.render('noauth/subPostRead', { post, subPost, home: id });
};

const updateView = async (req, res, next) => {
  const { id } = req.params;
  let post;

  try {
    post = await postDB.findById(id);
    if (!post) return next();
  } catch (e) {
    return next(e);
  }
  return res.render('team/postUpdate', { post });
};

const update = async (req, res, next) => {
  let { id } = req.params;
  let { title, tag, content, category } = req.body;

  if (!libPost.postValidation(req.body)) {
    return res.status(400).json('입력이 올바르지 않습니다.');
  }

  let result;
  let updateVal = { title, tag, content, category_no: category };

  try {
    result = await postDB.findById(id);
    if (!result) return next();
    result = await result.update(updateVal);
  } catch (e) {
    return next(e);
  }

  return res.status(204).end();
};

const updateSubView = async (req, res, next) => {
  const { id, subId } = req.params;

  let post;
  try {
    post = await subPostDB.findById(subId);
    if (!post) return next();
  } catch (e) {
    return next(e);
  }

  return res.render('team/subPostUpdate', { home: id, post });
};

const updateSubPost = async (req, res, next) => {
  let { subId } = req.params;
  let { title, content } = req.body;

  if (!libPost.subPostValidation(req.body)) {
    return res.status(400).json('입력이 올바르지 않습니다.');
  }

  let result;
  let updateVal = { title, content };

  try {
    result = await subPostDB.findById(subId);
    if (!result) return next();
    result = await result.update(updateVal);
  } catch (e) {
    return next(e);
  }
  return res.status(204).end();
};

const remove = async (req, res, next) => {
  let { id } = req.params;
  let result;
  try {
    result = await postDB.findById(id);
    if (!result) return next();
    await result.destroy(id);
  } catch (e) {
    return next(e);
  }
  res.status(204).end();
};

const removeSubPost = async (req, res, next) => {
  let { subId } = req.params;
  let result;
  try {
    result = await subPostDB.findById(subId);
    if (!result) return next();
    await result.destroy();
  } catch (e) {
    return next(e);
  }
  res.status(204).end();
};

const uploadImage = (req, res) => {
  return res.end(req.files[0].filename);
};

const categoryAdd = async (req, res, next) => {
  const { categoryName } = req.body;

  try {
    let result = await categoryDB.find(categoryName);
    if (result !== null) {
      return res.status(400).json('이미 존재하는 카테고리 입니다.');
    }
    result = await categoryDB.create(categoryName);
    return res.json({
      message: '카테고리 추가 성공',
      no: result.dataValues.no,
    });
  } catch (e) {
    e.message = '카테고리 추가 실패';
    next(e);
  }
};

module.exports = {
  createView,
  createSubView,
  create,
  createSubPost,
  list,
  show,
  showSubPost,
  updateView,
  update,
  updateSubView,
  updateSubPost,
  remove,
  removeSubPost,
  uploadImage,
  categoryAdd,
};

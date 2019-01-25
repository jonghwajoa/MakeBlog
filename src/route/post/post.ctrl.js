const postDB = require('../../db/repository/post');
const subPostDB = require('../../db/repository/subPost');
const visitDB = require('../../db/repository/visitCount');
const categoryDB = require('../../db/repository/categories');
const paging = require('../../lib/paging');
const paramCheck = require('../../lib/validation');


const createView = async (req, res) => {
  try {
    const category = await categoryDB.findAll();
    return res.render('team/postWrite', { category });
  } catch (e) {
    next(e);
  }
};

const createSubView = async (req, res, next) => {
  let no = req.params.id;
  let result;
  try {
    result = await postDB.findById(no);
  } catch (e) {
    return next(e);
  }
  if (!result) {
    return res.status(404).end();
  }

  return res.render('team/subPostWrite', { no: req.params.id });
};

const create = async (req, res, next) => {
  if (!paramCheck.postValidation(req.body)) {
    return res.status(400).json('입력이 올바르지 않습니다.');
  }

  try {
    let result = await postDB.creatPost(req.body, req.session.userid);
    return res.status(201).json({ no: result.dataValues.no });
  } catch (e) {
    return next(e);
  }
};

const createSubPost = async (req, res, next) => {
  let id = req.params.id;
  if (!paramCheck.subPostValidation(req.body)) {
    return res.status(400).json('입력이 올바르지 않습니다.');
  }

  try {
    let isExist = await postDB.findById(id);
    if (isExist == null) {
      return next();
    }
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

  pagingInfo = paging(totalCnt, req.query);
  const offset = (pagingInfo.page - 1) * pagingInfo.perPageNum;
  try {
    postList = await postDB.findAllList(pagingInfo.perPageNum, offset);
  } catch (e) {
    return next(e);
  }

  let returnObj = {
    postList,
    pagingInfo,
    hotPost,
    hotSubPost,
    monthCount,
    totalCount,
    today: req.today,
  };

  let path = 'noauth/postList';
  if (req.session.isLogin) {
    path = 'team/postList';
  }

  return res.render(path, { ...returnObj });
};

const show = async (req, res, next) => {
  const id = req.params.id;
  let post, subPost;

  try {
    post = await postDB.postFindById(id);
    if (!post) {
      return next();
    }
    subPost = await subPostDB.findByPostNo(id);
    post.updateAttributes({ count: post.dataValues.count + 1 });
  } catch (e) {
    return next(e);
  }

  if (req.headers['content-type'] === 'application/json') {
    return res.json({ post, subPost });
  }

  let path = 'noauth/postRead';
  if (req.session.isLogin) {
    path = 'team/postRead';
  }

  return res.render(path, { post, subPost });
};

const showSubPost = async (req, res, next) => {
  const { id, subId } = req.params;
  // json으로 컨텐츠 요청할 경우
  if (req.headers['content-type'] === 'application/json') {
    return getContent(req, res, next);
  }

  // subId=1 : Main Post
  if (subId === '1') {
    return show(req, res, next);
  }

  let post, subPost;
  try {
    post = await postDB.postFindById(id);
    if (post == null) {
      return next();
    }
    post = await subPostDB.findDetailByPostNo(id, subId);
    if (!post) return next();
    post.updateAttributes({ count: post.dataValues.count + 1 });
    subPost = await subPostDB.findByPostNo(id, subId);
  } catch (e) {
    return next(e);
  }

  if (req.session.isLogin) {
    return res.render('team/subPostRead', { post, subPost, home: id });
  }
  return res.render('noauth/subPostRead', { post, subPost, home: id });
};

const getContent = async (req, res, next) => {
  const { id, subId } = req.params;
  let post;

  try {
    post =
      subId === '1'
        ? await postDB.postFindById(id)
        : await subPostDB.findDetailByPostNo(id, subId);

    if (!post) {
      return next();
    }
    post.updateAttributes({ count: post.dataValues.count + 1 });
  } catch (e) {
    return next(e);
  }

  return res.json({ post });
};

const updateView = async (req, res, next) => {
  const { id } = req.params;
  let post, category;

  try {
    post = await postDB.findById(id);
    category = await categoryDB.findAll();
  } catch (e) {
    return next(e);
  }

  if (!post) {
    let err = new Error('Not Found');
    err.status = 404;
    return next(err);
  }
  return res.render('team/postUpdate', { post, category });
};

const update = async (req, res, next) => {
  let { id } = req.params;
  let { title, tag, content, category } = req.body;

  if (!paramCheck.postValidation(req.body)) {
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
    post = await subPostDB.findDetailByPostNo(id, subId);
    if (!post) return next();
  } catch (e) {
    return next(e);
  }

  return res.render('team/subPostUpdate', { home: id, post });
};

const updateSubPost = async (req, res, next) => {
  let { id, subId } = req.params;
  let { title, content } = req.body;

  if (!paramCheck.subPostValidation(req.body)) {
    return res.status(400).json('입력이 올바르지 않습니다.');
  }

  let result;
  let updateVal = { title, content };

  try {
    result = await subPostDB.findByNo(id, subId);
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
  let { id, subId } = req.params;
  let result;
  try {
    result = await subPostDB.findByNo(id, subId);
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
  let result;
  try {
    result = await categoryDB.find(categoryName);
    if (result !== null) {
      return res.status(400).json('이미 존재하는 카테고리 입니다.');
    }
    result = await categoryDB.create(categoryName);
  } catch (e) {
    e.message = '카테고리 추가 실패';
    next(e);
  }

  return res.json({
    message: '카테고리 추가 성공',
    no: result.dataValues.no,
  });
};

module.exports = {
  list,
  createView,
  create,
  show,
  updateView,
  update,
  remove,
  createSubView,
  createSubPost,
  showSubPost,
  updateSubView,
  updateSubPost,
  removeSubPost,
  uploadImage,
  categoryAdd,
};

/**
 * 파일업로드
 * 카테고리추가
 */

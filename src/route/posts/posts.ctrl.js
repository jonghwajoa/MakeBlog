const postDB = require('../../db/repository/post');
const subPostDB = require('../../db/repository/subPost');
const db = require('../../db');
const paging = require('../../lib/paging');
const paramCheck = require('../../lib/validation');

async function tagFindOrCreateByName(tags) {
  const tagsUUID = [];

  try {
    for (let e of tags) {
      let result = await db.Tags.findOrCreateByName(e);
      tagsUUID.push(result[0].getNo());
    }
  } catch (e) {
    let error = new Error('태그 생성실패');
    error.status = 500;
    throw error;
  }
  return tagsUUID;
}

const createView = async (req, res, next) => {
  try {
    return res.render('team/posts/new');
  } catch (e) {
    next(e);
  }
};

const createSubView = async (req, res, next) => {
  let no = req.params.id;
  let result;
  try {
    result = await db.Posts.findById(no);
  } catch (e) {
    return next(e);
  }
  if (!result) {
    return res.status(404).end();
  }

  return res.render('team/subpost/write', { no: req.params.id });
};

const create = async (req, res, next) => {
  let body = req.body;
  let { tags } = body;

  let validation = paramCheck.postValidationV2(body);
  if (!validation[0]) {
    return res.status(400).send(validation[1]);
  }
  let transaction;
  try {
    transaction = await db.sequelize.transaction();
    let tagsUUID = await tagFindOrCreateByName(tags);
    let createPostResult = await db.Posts.createPost(req.body, req.session.userid);
    let createPostNo = createPostResult.getNo();

    for (let e of tagsUUID) {
      await db.AssociationTag.createCompositeKey(createPostNo, e);
    }
    await transaction.commit();
    return res.status(201).json({ no: createPostNo });
  } catch (e) {
    await transaction.rollback();
    return next(e);
  }
};

const createSubPost = async (req, res, next) => {
  let id = req.params.id;
  if (!paramCheck.subPostValidation(req.body)) {
    return res.status(400).json('입력이 올바르지 않습니다.');
  }

  try {
    let isExist = await db.Posts.findById(id);
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
  let requestPage = req.query.page || 1;
  if (!paramCheck.isUINT(requestPage)) {
    const err = new Error('Bad Request');
    err.status = 400;
    return next(err);
  }

  try {
    [totalCnt, hotPost, hotSubPost, monthCount, totalCount, allTag] = await Promise.all([
      db.Posts.count(),
      db.Posts.findHotPost(),
      subPostDB.findHotPost(),
      db.VisitCount.findMonthCount(req.year, req.month),
      db.VisitCount.sum('count'),
      db.Tags.findAllWithCount(),
    ]);
  } catch (e) {
    return next(e);
  }

  pagingInfo = paging(totalCnt, req.query);
  const offset = (pagingInfo.page - 1) * pagingInfo.perPageNum;
  try {
    postList = await db.Posts.findAllWithPaging(pagingInfo.perPageNum, offset);
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
    allTag,
  };

  let path = 'noauth/posts/list';
  if (req.session.isLogin) {
    path = 'team/posts/list';
  }

  return res.render(path, { ...returnObj });
};

const read = async (req, res, next) => {
  const id = req.params.id;
  let post, subPost;

  try {
    post = await db.Posts.findDetailById(id);
    if (!post) {
      return next();
    }
    subPost = await db.SubPosts.findByPostNo(id);
    post.updateAttributes({ count: post.getCount() + 1 });
  } catch (e) {
    return next(e);
  }

  if (req.headers['content-type'] === 'application/json') {
    return res.json({ post, subPost });
  }

  let path = 'noauth/posts/read';
  if (req.session.isLogin) {
    path = 'team/posts/read';
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
    post = await db.Posts.findDetailById(id);
    if (post == null) {
      return next();
    }
    post = await subPostDB.findDetailByPostNo(id, subId);
    if (!post) return next();
    post.updateAttributes({ count: post.dataValues.count + 1 });

    subPost = await subPostDB.findAllSubPost(id, subId);
  } catch (e) {
    return next(e);
  }

  let path = 'noauth/subpost/read';
  if (req.session.isLogin) {
    path = 'team/subpost/read';
  }

  return res.render(path, { post, subPost, home: id });
};

const getContent = async (req, res, next) => {
  const { id, subId } = req.params;
  let post;

  try {
    if (subId === '1') {
      post = await db.Posts.findDetailById(id);
    } else {
      post = await subPostDB.findDetailByPostNo(id, subId);
    }

    if (!post) {
      return next();
    }
    post.updateAttributes({ count: post.dataValues.count + 1 });
  } catch (e) {
    return next(e);
  }

  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  return res.json(post);
};

const updateView = async (req, res, next) => {
  const { id } = req.params;
  let post;

  try {
    post = await db.Posts.findByIdForUpdate(id);
  } catch (e) {
    return next(e);
  }

  if (!post) {
    let err = new Error('Not Found');
    err.status = 404;
    return next(err);
  }
  return res.render('team/posts/update', { post });
};

const update = async (req, res, next) => {
  const { id } = req.params;
  const { title, tags, content } = req.body;
  const validation = paramCheck.postValidationV2(req.body);
  if (!validation[0]) {
    return res.status(400).send(validation[1]);
  }

  let postFindResult, transaction;
  let updateParams = { title, content };
  try {
    postFindResult = await db.Posts.findById(id);
    if (!postFindResult) return next();
    const tagsUUID = await tagFindOrCreateByName(tags);

    transaction = await db.sequelize.transaction();
    await db.AssociationTag.deleteByPostNoTransaction(id, transaction);
    for (let e of tagsUUID) {
      await db.AssociationTag.createCompositeKeyTransaction(id, e, transaction);
    }
    await transaction.commit();

    // update include 알아보기
    await db.Posts.updateTransaction(id, updateParams, transaction);
  } catch (e) {
    await transaction.rollback();
    console.log(e);
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

  return res.render('team/subpost/update', { home: id, post });
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
  let result, transaction;

  try {
    result = await db.Posts.findById(id);
    if (!result) return next();
    transaction = await db.sequelize.transaction();
    await subPostDB.deleteByForeignkey(id, transaction);
    await db.AssociationTag.deleteByPostNoTransaction(id, transaction);
    await result.destroy();
    await transaction.commit();
  } catch (e) {
    console.log(e);
    await transaction.rollback();
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

const addTag = async (req, res, next) => {
  const { requestTagName } = req.body;
  let result;

  if (!requestTagName) {
    return res.status(400).end();
  }

  try {
    result = await tagDB.findByName(requestTagName);
    if (result !== null) {
      return res.status(400).json('이미 존재하는 TAG 입니다.');
    }
    result = await tagDB.create(requestTagName);
  } catch (e) {
    e.message = 'TAG 추가 실패';
    next(e);
  }

  return res.status(201).json({
    message: 'TAG 추가 성공',
    no: result.dataValues.no,
  });
};

/**
 * @deprecated
 * 카테고리 기능 없애고 TAG로 교체
 */
const addCategory = async (req, res, next) => {
  const { requestCategoryName } = req.body;
  let result;

  if (!requestCategoryName) {
    return res.status(400).end();
  }

  try {
    result = await categoryDB.find(requestCategoryName);
    if (result !== null) {
      return res.status(400).json('이미 존재하는 카테고리 입니다.');
    }
    result = await categoryDB.create(requestCategoryName);
  } catch (e) {
    e.message = '카테고리 추가 실패';
    next(e);
  }

  return res.status(201).json({
    message: '카테고리 추가 성공',
    no: result.dataValues.no,
  });
};

/**
 * @deprecated
 * 카테고리 기능 없애고 TAG로 교체
 */
const removeCategory = async (req, res, next) => {
  let { id } = req.params;

  let categoryResult, postResult;

  try {
    categoryResult = await categoryDB.findById(id);
    if (!categoryResult) {
      return res.status(404).json({ message: '없는 카테고리 입니다.' });
    }
    postResult = await postDB.findByCategoryId(id);
    if (postResult) {
      return res.status(409).json({ message: '사용중인 카테고리는 삭제할 수 없습니다.' });
    }

    await categoryResult.destroy();
  } catch (e) {
    return next(e);
  }

  return res.status(204).end();
};

module.exports = {
  updateView,
  createSubView,
  createSubPost,
  showSubPost,
  updateSubView,
  updateSubPost,
  removeSubPost,
  list,
  create,
  createView,
  read,
  update,
  remove,
  addTag,
  uploadImage,

  /**
   * @deprecated
   */
  addCategory,
  removeCategory,
};

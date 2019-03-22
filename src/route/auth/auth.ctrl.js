const db = require('../../db');
const validation = require('../../lib/validation');
const bcrypt = require('bcrypt');

const loginView = (req, res, next) => {
  res.render('noauth/auth/login');
};

const login = async (req, res, next) => {
  let { id, pw } = req.body;

  if (!validation.arrayElementIsString([id, pw])) {
    return res.status(400).json('입력이 올바르지 않습니다.');
  }

  if (!(validation.isLength(id, 5, 20) && validation.isLength(pw, 5, 20))) {
    return res.status(400).json('입력이 올바르지 않습니다.');
  }

  id = id.toLowerCase();
  pw = pw.toLowerCase();

  let checkId;
  try {
    checkId = await db.UserLogin.findOneById(id);
  } catch (e) {
    next(e);
  }

  if (!checkId) {
    return res.status(404).json('아이디 혹은 패스워드가 일치하지 않습니다.');
  }

  let { no, hash } = checkId.dataValues;
  let checkPw;

  try {
    checkPw = await bcrypt.compare(pw, hash);
  } catch (e) {
    next(e);
  }

  if (!checkPw) {
    return res.status(404).json('아이디 혹은 패스워드가 일치하지 않습니다.');
  }

  req.session.isLogin = true;
  req.session.userid = no;
  return res.status(200).end();
};

const registerView = (req, res) => {
  return res.render('noauth/auth/register');
};

const register = async (req, res, next) => {
  let { id, pw, nickname } = req.body;

  if (!validation.arrayElementIsString([id, pw, nickname])) {
    return res.status(400).json('입력이 올바르지 않습니다.');
  }

  if (!(validation.isLength(id, 5, 20) && validation.isLength(pw, 5, 20) && validation.isLength(nickname, 2, 20))) {
    return res.status(400).json('입력이 올바르지 않습니다.');
  }

  id = id.toLowerCase();
  pw = pw.toLowerCase();
  let isExistId;
  try {
    isExistId = await db.UserLogin.findOneById(id);
  } catch (e) {
    return next(e);
  }

  if (isExistId) {
    return res.status(400).json('이미존재하는 아이디입니다.');
  }

  let salt;
  let hash;
  try {
    salt = await bcrypt.genSalt(11);
    hash = await bcrypt.hash(pw, salt);
  } catch (e) {
    return next(e);
  }

  let result, transaction;
  try {
    transaction = await db.sequelize.transaction();
    result = await db.UserLogin.createTransaction(id, hash, transaction);
    const userNo = result.dataValues.no;
    await db.Users.createTransaction(userNo, id, nickname, transaction);
    await transaction.commit();
  } catch (e) {
    await transaction.rollback();
    return next(e);
  }

  return res.status(201).json({ id });
};

const logout = (req, res, next) => {
  /**
   * 비로그인시 로그아웃을 요청해도 200을 반환하라고 한다.
   * 사용자가 로그아웃상태인지 인지하지 못한상태로 요청한 것이기때문에..
   * 200을 사용하라고 한다..
   */
  req.session.destroy(err => {
    if (err) {
      return next(err);
    }
    res.clearCookie('WeKnowJS');
    res.redirect('/');
  });
};

module.exports = {
  login,
  loginView,
  register,
  registerView,
  logout,
};

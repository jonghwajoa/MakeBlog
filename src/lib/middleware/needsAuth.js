const isLogin = (req, res, next) => {
  if (req.session.isLogin === undefined || !req.session.isLogin) {
    let error = new Error('UnAuthorized');
    error.status = 401;
    return next(error);
  }
  next();
};

module.exports = isLogin;

function isLogin(req, res, next) {
  if (req.session.isLogin === undefined || !req.session.isLogin) {
    if (req.headers['content-type'] === 'application/json') {
      return res.status(401).json({ message: 'UnAuthorized' });
    }
    return res.status(401).render('error/unauthorized');
  }
  next();
}

module.exports = {
  isLogin,
};

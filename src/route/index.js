const express = require('express');
const router = express.Router();
const errorDB = require('../db/repository/errorLog');

router.get('/', async (req, res) => {
  return res.status(301).redirect('/post');
});

router.use('/solving', require('./solving'));
router.use('/auth', require('./auth'));
router.use('/post', require('./post'));
router.use('/about', require('./about'));
router.use('/robots.txt', require('./robots'));

router.use((req, res) => {
  if (req.headers['content-type'] === 'application/json') {
    return res.status(404).json({ message: 'Not Found' });
  }

  // if (req.session.isLogin) return res.status(404).render('error/404');
  return res.status(404).render('error/404', { isLogin: req.session.isLogin });
});

router.use((err, req, res, next) => {
  err.status = err.status || 500;
  err.message = err.message || 'Server Error';
  if (err.status >= 500) {
    errorDB.create(
      err.status,
      err.stack,
      req.ip.substr(7),
      req.headers['referer'],
      req._parsedUrl.path,
    );
  }

  if (req.headers['content-type'] === 'application/json') {
    return res.status(err.status).json({ message: err.message });
  }

  if (err.status === 400) {
    return res.status(err.status).render('error/badRequest');
  } else if (err.status === 401) {
    return res.status(err.status).render('error/unauthorized');
  } else {
    return res.status(err.status).render('error/serverError');
  }
});

module.exports = router;

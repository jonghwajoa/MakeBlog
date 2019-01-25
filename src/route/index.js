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

router.use((req, res) => {
  if (req.headers['content-type'] === 'application/json') {
    return res.status(404).json({ message: 'Not Found' });
  }

  if (req.session.isLogin) return res.status(404).render('team/404');
  res.status(404).render('noauth/404');
});

router.use((err, req, res, next) => {
  err.status = err.status || 500;
  err.message = err.message || 'Server Error';
  console.log(err);
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

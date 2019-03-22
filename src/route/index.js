const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
  return res.status(301).redirect('/posts');
});

router.use('/api', require('./api'));
router.use('/solving', require('./solving'));
router.use('/auth', require('./auth'));
router.use('/posts', require('./posts'));
router.use('/about', require('./about'));
router.use('/admin', require('./admin'));
router.use('/robots.txt', require('./robots'));

router.use((req, res, next) => {
  let error = new Error('Not Found');
  error.status = 404;
  next(error);
});

router.use((err, req, res, next) => {
  err.status = err.status || 500;
  err.message = err.message || 'Server Error';

  console.log(err);

  if (err.status >= 500) {
    db.ErrorLog.createLog(err.status, err.stack, req.ip.substr(7), req.headers['referer'], req._parsedUrl.path);
  }

  if (req.headers.accept && req.headers.accept.indexOf('json') > -1) {
    return res.status(err.status).json({ message: err.message });
  }

  let message = err.message;
  if (err.status === 400) {
    message = 'BadRequest';
  } else if (err.status === 401) {
    message = 'unauthorized';
  } else if (err.status >= 500) {
    message = 'Server Error';
  }

  if (req.session.isLogin === undefined || !req.session.isLogin) {
    return res.status(err.status).render('error/error', { status: err.status, message, auth: false });
  }
  return res.status(err.status).render('error/error', { status: err.status, message, auth: true });
});

module.exports = router;

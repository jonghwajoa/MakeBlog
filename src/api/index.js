const express = require('express');
const router = express.Router();
const errorDB = require('../db/repository/errorLog');

router.get('/', async (req, res) => {
  return res.status(301).redirect('/posts');
});

router.get('/about', async (req, res) => {
  if (req.session.isLogin) return res.render('team/aboutTeam');
  return res.render('noauth/aboutTeam');
});

router.get('/test', (req, res) => {
  return res.render('deleteindex');
});

router.use('/auth', require('./auth'));
router.use('/posts', require('./posts'));

router.use((req, res) => {
  if (req.headers['content-type'] === 'application/json') {
    return res.status(404).json('Not Found');
  }

  if (req.session.isLogin) return res.status(404).render('team/404');
  res.status(404).render('noauth/404');
});

router.use((err, req, res, next) => {
  err.status = err.status || 500;
  err.message = err.message || 'Server Error';

  if (err.status === 500) {
    errorDB.create(err.status, err.stack);
  }

  if (req.headers['content-type'] === 'application/json') {
    return res.status(err.status).json(err.message);
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

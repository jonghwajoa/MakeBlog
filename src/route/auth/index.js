const express = require('express');
const router = express.Router();
const ctrl = require('./auth.ctrl');
const { isLogin } = require('../../lib/middleware/isAuth');

router
  .route('/login')
  .get(ctrl.loginView)
  .post(ctrl.login);

router
  .route('/register')
  .get(ctrl.registerView)
  .post(ctrl.register);

router.get('/logout', ctrl.logout);

module.exports = router;

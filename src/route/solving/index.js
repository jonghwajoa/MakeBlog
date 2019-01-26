const router = require('express').Router();
const ctrl = require('./solving.ctrl');
const { isLogin, paramIsINT } = require('../../lib/validation');

router
  .route('/')
  .get(ctrl.list)
  .post(isLogin, ctrl.create);

router.route('/new').get(isLogin, ctrl.createView);

module.exports = router;

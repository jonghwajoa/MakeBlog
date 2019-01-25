const router = require('express').Router();
const ctrl = require('./solving.ctrl');
const { isLogin, paramIsINT } = require('../../lib/validation');

router.route('/').get(ctrl.list);
router.route('/new').get(ctrl.createView);

module.exports = router;

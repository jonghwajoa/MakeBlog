const router = require('express').Router();
const ctrl = require('./admin.ctrl');

router.route('/').get(ctrl.index);
router.route('/error').get(ctrl.errorPage);

module.exports = router;

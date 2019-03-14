const router = require('express').Router();
const ctrl = require('./admin.ctrl');

router.route('/').get(ctrl.index);

module.exports = router;

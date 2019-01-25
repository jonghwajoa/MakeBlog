const router = require('express').Router();
const ctrl = require('./cote.ctrl');

router.route('/').get(ctrl.list);

module.exports = router;

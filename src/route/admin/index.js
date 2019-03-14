const router = require('express').Router();
const ctrl = require('./admin.ctrl');

router.route('/').get();

module.exports = router;

const express = require('express');
const router = express.Router();
const ctrl = require('./cote.ctrl');
//const { isLogin } = require('../../lib/middleware/isAuth');

router.route('/').get(ctrl.list);

module.exports = router;

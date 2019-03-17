const router = require('express').Router();
const ctrl = require('./admin.restCtrl');

router.route('/admin/monthly').get(ctrl.searchMonthly);

module.exports = router;

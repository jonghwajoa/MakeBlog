const router = require('express').Router();
const ctrl = require('./admin.restCtrl');

router.route('/admin/daily').get(ctrl.searchMonthly);
router.route('/admin/monthly').get(ctrl.searchYear);

module.exports = router;

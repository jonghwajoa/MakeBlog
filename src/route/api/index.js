const router = require('express').Router();
const ctrl = require('./admin.restCtrl');

router.route('/admin/daily').get(ctrl.searchDaily);
router.route('/admin/monthly').get(ctrl.searchMonthly);
router.route('/admin/error/errorCheck').patch(ctrl.errorCheck);

module.exports = router;

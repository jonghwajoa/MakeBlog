const router = require('express').Router();
const ctrl = require('./admin.restCtrl');
const needsAuth = require('../../lib/middleware/needsAuth');
const {
  adminPageQueryCheck,
  searchDailyQueryCheck,
  searchMonthlQueryCheck,
} = require('../../lib/middleware/checkParam');

router.route('/admin/daily').get(needsAuth, adminPageQueryCheck, searchDailyQueryCheck, ctrl.searchDaily);
router.route('/admin/monthly').get(needsAuth, adminPageQueryCheck, searchMonthlQueryCheck, ctrl.searchMonthly);
router.route('/admin/error/errorCheck').patch(needsAuth, ctrl.errorCheck);

module.exports = router;

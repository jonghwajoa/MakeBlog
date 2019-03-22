const router = require('express').Router();
const ctrl = require('./admin.restCtrl');
const needsAuth = require('../../lib/middleware/needsAuth');

router.route('/admin/daily').get(needsAuth, ctrl.searchDaily);
router.route('/admin/monthly').get(needsAuth, ctrl.searchMonthly);
router.route('/admin/error/errorCheck').patch(needsAuth, ctrl.errorCheck);

module.exports = router;



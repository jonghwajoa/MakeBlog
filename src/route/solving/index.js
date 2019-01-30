const router = require('express').Router();
const ctrl = require('./solving.ctrl');
const { paramIsINT } = require('../../lib/middleware/checkParam');
const needsAuth = require('../../lib/middleware/needsAuth');

router
  .route('/')
  .get(ctrl.list)
  .post(needsAuth, ctrl.create)
  .put(needsAuth, ctrl.update);

router.route('/new').get(needsAuth, ctrl.createView);
router.route('/:id').get(ctrl.show).delete(ctrl.remove)
router.route('/:id/edit').get(needsAuth, ctrl.updateView);

module.exports = router;

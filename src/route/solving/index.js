const router = require('express').Router();
const ctrl = require('./solving.ctrl');
const { paramIsINT } = require('../../lib/middleware/checkParam');
const needsAuth = require('../../lib/middleware/needsAuth');

router
  .route('*')
  .post(needsAuth)
  .put(needsAuth)
  .delete(needsAuth);

router
  .route('/')
  .get(ctrl.list)
  .post(ctrl.create)
  .put(ctrl.update);

router.route('/category').post(ctrl.addCategory);
router.route('/category/:id').delete(ctrl.removeCategory);

router.route('/new').get(needsAuth, ctrl.createView);
router
  .route('/:id')
  .get(ctrl.show)
  .delete(ctrl.remove);
router.route('/:id/edit').get(needsAuth, ctrl.updateView);

module.exports = router;

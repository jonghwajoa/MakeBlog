const router = require('express').Router();
const ctrl = require('./solving.ctrl');
const { isLogin, paramIsINT } = require('../../lib/validation');

router
  .route('/')
  .get(ctrl.list)
  .post(isLogin, ctrl.create)
  .put(ctrl.update)

router.route('/new').get(isLogin, ctrl.createView);
router.route('/:id').get(ctrl.show);
router.route('/:id/edit').get(ctrl.updateView);

module.exports = router;

const router = require('express').Router();
const ctrl = require('./solving.ctrl');
const { isLogin, paramIsINT } = require('../../lib/validation');

router
  .route('/')
  .get(ctrl.list)
  .post(ctrl.create);

router.route('/new').get(ctrl.createView);
router.route("/:id").get(ctrl.show)

module.exports = router;

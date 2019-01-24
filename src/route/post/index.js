const express = require('express');
const router = express.Router();
const ctrl = require('./post.ctrl');
const checkPram = require('../../lib/validation/isInteger');
const { isLogin } = require('../../lib/middleware/isAuth');
const bcrypt = require('bcrypt');
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'src/uploads/images');
  },
  filename: async function(req, file, cb) {
    const fileName = file.originalname.toLowerCase().split('.');
    let reName;
    try {
      const salt = await bcrypt.genSalt(10);
      reName = await bcrypt.hash(fileName[0], salt);
    } catch (e) {
      cb(null, false);
    }
    let finalName = `${reName}.${fileName[fileName.length - 1]}`.replace(
      /\//g,
      'v',
    );
    cb(null, finalName);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: '500KB',
  },
  fileFilter: function(req, file, cb) {
    const mimetype = file.mimetype.split('/');
    mimetype[0] === 'image' ? cb(null, true) : cb(null, false);
  },
});

/* 입력값 검증*/
//로그인체크 -> 파라미터 체크
router
  .route('*')
  .post(isLogin)
  .put(isLogin)
  .delete(isLogin);
router.get(['/new', '/:id/new', '/:id/edit', '/id/:subId/edit'], isLogin);

router.route('/:id').all(checkPram.paramIsINT);
/* 검증 끝*/

router
  .route('/')
  .get(ctrl.list)
  .post(ctrl.create);

router.get('/new', ctrl.createView);

router.post('/file', upload.array('photo'), ctrl.uploadImage);
router.post('/category', ctrl.categoryAdd);

router
  .route('/:id')
  .get(ctrl.show)
  .put(ctrl.update)
  .delete(ctrl.remove);

/* 여기부터는 subPost */

router.get('/:id/new', checkPram.paramIsINT, ctrl.createSubView);
router.route('/:id/').post(checkPram.paramIsINT, ctrl.createSubPost);

router
  .route('/:id/:subId')
  .get(checkPram.isEdit, checkPram.paramIsINT, ctrl.showSubPost)
  .put(checkPram.paramIsINT, ctrl.updateSubPost)
  .delete(checkPram.paramIsINT, ctrl.removeSubPost);

router.get('/:id/edit', checkPram.paramIsINT, ctrl.updateView);
router.get('/:id/:subId/edit', checkPram.paramIsINT, ctrl.updateSubView);

module.exports = router;

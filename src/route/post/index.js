const router = require('express').Router();
const multer = require('multer');
const bcrypt = require('bcrypt');
const ctrl = require('./post.ctrl');
const { isLogin, paramIsINT } = require('../../lib/validation');

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

/** 입력값 검증
 * 로그인확인 -> 파라미터 확인
 * */

router
  .route('*')
  .post(isLogin)
  .put(isLogin)
  .delete(isLogin);

router.get(['/new', '/:id/new', '/:id/edit', '/:id/:subId/edit'], isLogin);
router.route('/:id').all(paramIsINT);

/* post route */
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
  .post(ctrl.createSubPost)
  .put(ctrl.update)
  .delete(ctrl.remove);

/* subPost route */
router.get('/:id/new', paramIsINT, ctrl.createSubView);
router.get('/:id/edit', paramIsINT, ctrl.updateView);

/* 서브포스트 파라미터 검사 */
router.route('/:id/:subId').all(paramIsINT);

router
  .route('/:id/:subId')
  .get(ctrl.showSubPost)
  .put(ctrl.updateSubPost)
  .delete(ctrl.removeSubPost);
router.get('/:id/:subId/edit', paramIsINT, ctrl.updateSubView);

module.exports = router;

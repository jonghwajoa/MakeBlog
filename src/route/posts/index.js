const router = require('express').Router();
const multer = require('multer');
const ctrl = require('./posts.ctrl');
const { paramIsINT } = require('../../lib/middleware/checkParam');
const needsAuth = require('../../lib/middleware/needsAuth');
const uuidv4 = require('uuid/v4');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'src/uploads/images');
  },
  filename: async function(req, file, cb) {
    const fileName = file.originalname.toLowerCase().split('.');
    let reName = `${new Date().getTime()}${uuidv4()}`;
    let extension = fileName[fileName.length - 1];
    let savaFileName = `${reName}.${extension}`;
    cb(null, savaFileName);
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

router
  .route('*')
  .post(needsAuth)
  .put(needsAuth)
  .delete(needsAuth);
//'/new'
router.get(['/:id/new', '/:id/edit', '/:id/:subId/edit'], needsAuth);

/* post route */
router
  .route('/')
  .get(ctrl.list)
  .post(ctrl.create);

router.get('/new', ctrl.createView);
router.post('/file', upload.array('photo'), ctrl.uploadImage);

router.route('/tag').post(ctrl.addTag);

router.route('/:id').all(paramIsINT);
router
  .route('/:id')
  .get(ctrl.read)
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

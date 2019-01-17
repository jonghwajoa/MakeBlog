const express = require('express');
const router = express.Router();
const ctrl = require('./posts.ctrl');
const checkPram = require('../../lib/validation/isInteger');
const { isLogin, isLoginPhoto } = require('../../lib/middleware/isAuth');
const { Checkcors } = require('../../lib/middleware/cors');
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

router
  .route('/')
  .get(ctrl.list)
  .post(Checkcors, isLogin, ctrl.create);

router.get('/new', isLogin, ctrl.createView);

router.post('/file', upload.array('photo'), ctrl.uploadImage);

router
  .route('/:id')
  .get(checkPram.paramIsINT, ctrl.show)
  .put(Checkcors, isLogin, checkPram.paramIsINT, ctrl.update)
  .delete(Checkcors, isLogin, checkPram.paramIsINT, ctrl.remove);

router.get('/:id/new', isLogin, checkPram.paramIsINT, ctrl.createSubView);
router
  .route('/:id/')
  .post(Checkcors, isLogin, checkPram.paramIsINT, ctrl.createSubPost);

router
  .route('/:id/:subId')
  .get(checkPram.isEdit, checkPram.paramIsINT, ctrl.showSubPost)
  .put(Checkcors, isLogin, checkPram.paramIsINT, ctrl.updateSubPost)
  .delete(Checkcors, isLogin, checkPram.paramIsINT, ctrl.removeSubPost);

router.get('/:id/edit', isLogin, checkPram.paramIsINT, ctrl.updateView);
router.get('/:id/:subId/edit', checkPram.paramIsINT, ctrl.updateSubView);

module.exports = router;

const router = require('express').Router();

router.get('/', async (req, res) => {
  if (req.session.isLogin) return res.render('team/aboutTeam');
  return res.render('noauth/aboutTeam');
});

module.exports = router;

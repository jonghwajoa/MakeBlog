const router = require('express').Router();

router.get('/', async (req, res) => {
  if (req.session.isLogin) return res.render('team/about/aboutTeam');
  return res.render('noauth/about/aboutTeam');
});

module.exports = router;

const router = require('express').Router();

router.get('/', (req, res, next) => {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  return res
    .status(200)
    .type('text/plain')
    .send(
      'User-agent: *\ndisallow: /auth/\n\nUser-agent: Baiduspider\nDisallow: /\nUser-agent: MJ12bot\nDisallow: / ',
    );
});

module.exports = router;

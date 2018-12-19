function Checkcors(req, res, next) {
  // if (req.headers.origin !== 'https://www.weknowjs.xyz') {
  //   return res.status(400).send('cors ban');
  // }
  next();
}

module.exports = {
  Checkcors,
};

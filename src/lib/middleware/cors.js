const checkCors = (req, res, next) => {
  let origin = req.headers.origin;
  // if (origin !== ['https://www.weknowjs.xyz']) {
  //   console.log(req.headers.origin);
  //   return res.status(400).send('cors ban');
  // }

  if (origin == undefined) {
    return next();
  }
  return res.status(400).send('cors ban');
};

module.exports = {
  checkCors,
};

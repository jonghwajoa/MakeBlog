function paramIsINT(req, res, next) {
  let param = Object.values(req.params);
  if (param[0] === 'new') {
    return next();
  }

  for (let element of param) {
    element = parseInt(element);
    if (!(element > 0)) {
      const err = new Error('BadRequest');
      err.status = 400;
      return next(err);
    }
  }
  next();
}

function isEdit(req, res, next) {
  let subId = req.params.subId;
  if (subId === 'edit') return next('route');
  next();
}

module.exports = {
  paramIsINT,
  isEdit,
};

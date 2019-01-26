/**
 * @deprecated
 */
const isString = str => {
  return typeof str === 'string';
};

const arrayElementIsString = strArray => {
  for (let value of strArray) {
    if (typeof value !== 'string') {
      return false;
    }
  }

  return true;
};

const paramsIsNotNull = params => {
  let objectVal = Object.values(params);
  for (let e of objectVal) {
    if (typeof e !== 'string') {
      return false;
    }
  }
  return true;
};

/**
 * @param {String} val
 * @param {number} min
 * @param {number} max
 * @returns {Boolean}
 */
const isLength = (val, min, max = Number.MAX_SAFE_INTEGER) => {
  const valLen = val.length;
  if (min > max) {
    [min, max] = [max, min];
  }
  return valLen > min && valLen < max;
};

const isUINT = num => {
  num = parseInt(num);
  return num > 0;
};

const checkTag = tag => {
  let array = tag.split(' ');
  for (let item of array) {
    if (item[0] !== '#') return false;
  }
  return true;
};

const paramIsINT = (req, res, next) => {
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
  return next();
};

const isLogin = (req, res, next) => {
  if (req.session.isLogin === undefined || !req.session.isLogin) {
    if (req.headers['content-type'] === 'application/json') {
      return res.status(401).json({ message: 'UnAuthorized' });
    }
    return res.status(401).render('error/unauthorized');
  }
  next();
};

/**
 * @deprecated
 */
const isEdit = (req, res, next) => {
  let subId = req.params.subId;
  if (subId === 'edit') return next('route');
  next();
};

const postValidation = ({ title, tag, content, category }) => {
  if (!content) return false;

  if (!arrayElementIsString([title, tag, content, category])) {
    return false;
  }

  if (!isLength(title, 1, 100) || !isLength(tag, 1, 100)) {
    return false;
  }

  if (!checkTag(tag)) {
    return false;
  }

  return true;
};

const subPostValidation = ({ title, content }) => {
  if (!arrayElementIsString([title, content]) || !isLength(title, 1, 100)) {
    return false;
  }
  return true;
};

/**
 * @param {Object} params
 * @param {String} params.title
 * @param {String} params.scontent
 * @param {String} params.resource
 * @param {Number} params.category
 * @returns {Boolean}
 */
const solvingValidation = ({ title, content, url, problemNum, category }) => {
  if (!arrayElementIsString([title, content, url, problemNum, category])) {
    return false;
  }

  if (!isUINT(category)) {
    return false;
  }

  return true;
};

module.exports = {
  isString,
  arrayElementIsString,
  isLength,
  isUINT,
  paramIsINT,
  isLogin,
  isEdit,
  postValidation,
  subPostValidation,
  solvingValidation,
};

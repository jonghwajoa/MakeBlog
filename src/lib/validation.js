/**
 * @deprecated
 */
const isString = str => {
  return typeof str === 'string';
};

/**
 * @deprecated
 */
const paramsIsNotNull = params => {
  let objectVal = Object.values(params);
  for (let e of objectVal) {
    if (typeof e !== 'string') {
      return false;
    }
  }
  return true;
};

const arrayElementIsString = strArray => {
  if (!Array.isArray(strArray)) {
    return false;
  }

  for (let value of strArray) {
    if (typeof value !== 'string') {
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

const postValidation = ({ title, tag, content = '', category }) => {
  content = content.trim();
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

const subPostValidation = ({ title, content = '' }) => {
  content = content.trim();
  if (!content) return false;

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
  postValidation,
  subPostValidation,
  solvingValidation,
};

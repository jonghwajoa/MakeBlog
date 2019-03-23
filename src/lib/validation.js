/**
 *
 * @param {Array} strArray
 * @returns {Boolean}
 * @since version 2.1
 */
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
 *
 * @param {String} val
 * @param {number} min
 * @param {number} max
 * @returns {Boolean}
 * @since version 1.0
 */
const isLength = (val, min, max = Number.MAX_SAFE_INTEGER) => {
  const valLen = val.length;
  if (min > max) {
    [min, max] = [max, min];
  }
  return valLen > min && valLen < max;
};

const isUINT = num => {
  num = Number(num);
  return num > 0;
};

/**
 * @since version 2.1
 */
const checkArrayTag = tag => {
  if (!tag || tag.length <= 0) {
    return false;
  }

  for (let e of tag) {
    if (!e.trim().length) {
      return false;
    }
  }
  return true;
};

/**
 * @since version 2.1
 */
const postValidationV2 = ({ title = '', tags, content = '' }) => {
  content = content.trim();
  if (!content) return [false, 'content가 올바르지 않습니다.'];

  if (!checkArrayTag(tags)) {
    return [false, 'tag가 올바르지 않습니다.'];
  }

  if (!isLength(title, 1, 100)) {
    return [false, 'title이 올바르지 않습니다.'];
  }

  return [true];
};

/**
 * @since version 2.1
 */
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
 * @param {String} params.content
 * @param {String} params.url
 * @param {Number} params.category
 * @returns {Boolean}
 * @since version 2.1
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
  arrayElementIsString,
  isLength,
  isUINT,
  subPostValidation,
  solvingValidation,
  postValidationV2,
  checkArrayTag,
};

const isString = str => {
  return typeof str === 'string';
};

const arrayElementIsString = strArray => {
  for (value of strArray) {
    if (typeof value !== 'string') {
      return false;
    }
  }

  return true;
};

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

module.exports = {
  isString,
  arrayElementIsString,
  isLength,
  isUINT,
  checkTag,
};

isString = str => {
  return typeof str === 'string';
};

arrayElementIsString = strArray => {
  for (value of strArray) {
    if (typeof value !== 'string') {
      return false;
    }
  }

  return true;
};

isLength = (val, min, max = Number.MAX_SAFE_INTEGER) => {
  const valLen = val.length;
  if (min > max) {
    [min, max] = [max, min];
  }
  return valLen > min && valLen < max;
};

isUINT = num => {
  num = parseInt(num);
  return num > 0;
};

checkTag = tag => {
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

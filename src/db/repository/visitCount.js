const { VisitCount } = require('../../db');

const findOrCreate = (year, month, day) => {
  return VisitCount.findOrCreate({
    where: {
      year,
      month,
      day,
    },
  });
};

const findMonthCount = (year, month) => {
  return VisitCount.sum('count', {
    where: { year, month },
  });
};

const findToalCount = month => {
  return VisitCount.sum('count');
};

module.exports = {
  findOrCreate,
  findMonthCount,
  findToalCount,
};

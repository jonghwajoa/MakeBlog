const { VisitCount } = require('../../db');

findOrCreate = (year, month, day) => {
  return VisitCount.findOrCreate({
    where: {
      year,
      month,
      day,
    },
  });
};

findMonthCount = (year, month) => {
  return VisitCount.sum('count', {
    where: { year, month },
  });
};

findToalCount = month => {
  return VisitCount.sum('count');
};

module.exports = {
  findOrCreate,
  findMonthCount,
  findToalCount,
};

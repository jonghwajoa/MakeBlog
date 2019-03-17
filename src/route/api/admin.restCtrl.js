const db = require('../../db');
const validation = require('../../lib/validation');

const searchMonthly = async (req, res, next) => {
  let result;
  const { year, month } = req.query;

  try {
    result = await db.VisitCount.findDailyCount(year, Number(month));
  } catch (e) {
    next(e);
  }

  const day = [];
  const count = [];
  const length = result.length;

  for (let i = 0; i < length; i++) {
    day[i] = result[i].day;
    count[i] = result[i].count;
  }

  return res.json({ day, count });
};

const searchYear = async (req, res, next) => {
  let result;
  const { year } = req.query;

  try {
    result = await db.VisitCount.findMonthlyVisitorCount(year);
  } catch (e) {
    next(e);
  }

  console.log(result);

  const month = [];
  const count = [];
  const length = result.length;

  for (let i = 0; i < length; i++) {
    month[i] = result[i].month;
    count[i] = result[i].count;
  }

  return res.json({ month, count });
};

module.exports = {
  searchMonthly,
  searchYear,
};

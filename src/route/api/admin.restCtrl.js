const db = require('../../db');

const searchMonthly = async (req, res, next) => {
  let result;

  const { year, month } = req.query;

  try {
    result = await db.VisitCount.findMontly(year, Number(month));
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

module.exports = {
  searchMonthly,
};

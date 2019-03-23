const db = require('../../db');

const searchDaily = async (req, res, next) => {
  const { year, month } = req.query;
  let result;

  try {
    result = await db.VisitCount.findDailyCount(year, month);
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

const searchMonthly = async (req, res, next) => {
  let result;
  const { year } = req.query;

  try {
    result = await db.VisitCount.findMonthlyVisitorCount(year);
  } catch (e) {
    next(e);
  }

  const month = [];
  const count = [];
  const length = result.length;

  for (let i = 0; i < length; i++) {
    month[i] = result[i].month;
    count[i] = result[i].count;
  }

  return res.json({ month, count });
};

const errorCheck = async (req, res, next) => {
  let { no, isCheck } = req.body;

  no = Number(no);
  isCheck = Number(isCheck);

  let result;
  try {
    result = await db.ErrorLog.findById(no);
    if (!result) {
      next(result);
    }
    await result.update({ no, isCheck }, { raws: true });
  } catch (e) {
    next(e);
  }
  return res.status(204).end();
};

module.exports = {
  searchDaily,
  searchMonthly,
  errorCheck,
};

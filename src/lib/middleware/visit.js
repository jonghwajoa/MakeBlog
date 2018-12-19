const visitDB = require('../../db/repository/visitCount');

async function visitToday(req, res, next) {
  const date = new Date();
  let result;
  const [year, month, day] = getToday(date);
  try {
    result = await visitDB.findOrCreate(year, month, day);
    if (!req.cookies.count) {
      res.cookie('count', 'true');
      result[0].updateAttributes({ count: result[0].dataValues.count + 1 });
    }
  } catch (e) {
    next(e);
  }
  req.today = result[0].dataValues.count;
  req.year = year;
  req.month = month;
  next();
}

getToday = date => {
  return ([year, month, day] = [
    date.getFullYear(),
    ('0' + (date.getMonth() + 1)).slice(-2),
    ('0' + date.getDate()).slice(-2),
  ]);
};

module.exports = {
  visitToday,
};

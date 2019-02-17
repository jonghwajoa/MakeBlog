const db = require('../../db');
const uaParse = require('ua-parser-js');

async function visit(req, res, next) {
  const date = new Date();
  let result;
  const [year, month, day] = getToday(date);
  try {
    result = await db.VisitCount.findOrCreateToday(year, month, day);
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

  const ua = uaParse(req.headers['user-agent']);
  const log = {
    browser_name: ua.browser.name,
    browser_ver: ua.browser.major,
    os_name: ua.os.name,
    os_ver: ua.os.version,
    device: ua.device.model,
    device_type: ua.device.type,
    device_vendor: ua.device.vendor,
    ip: req.ip.substr(7),
    referrer: req.headers['referer'],
    path: req._parsedUrl.path,
    year,
    month,
    day,
  };

  db.VisitLog.createByObj(log);

  next();
}

const getToday = date => {
  return ([year, month, day] = [
    date.getFullYear(),
    ('0' + (date.getMonth() + 1)).slice(-2),
    ('0' + date.getDate()).slice(-2),
  ]);
};

module.exports = {
  visit,
};

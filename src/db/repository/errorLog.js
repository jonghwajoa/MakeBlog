const { errorLog } = require('../../db');

const create = (status, content, ip, referrer, path) => {
  return errorLog.create({
    status,
    content,
    ip,
    referrer,
    path,
  });
};

module.exports = {
  create,
};

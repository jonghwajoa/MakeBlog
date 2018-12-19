const { errorLog } = require('../../db');

create = (status, content) => {
  return errorLog.create({
    status,
    content,
  });
};

module.exports = {
  create,
};

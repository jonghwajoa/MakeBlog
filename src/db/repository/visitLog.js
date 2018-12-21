const { VisitLog } = require('../../db');

create = obj => {
  return VisitLog.create({
    ...obj,
  });
};

module.exports = {
  create,
};

const { VisitLog } = require('../../db');

const create = obj => {
  return VisitLog.create({
    ...obj,
  });
};

module.exports = {
  create,
};

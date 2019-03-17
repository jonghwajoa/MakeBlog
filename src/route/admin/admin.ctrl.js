const db = require('../../db');

const index = async (req, res, next) => res.render('team/admin/index');

module.exports = {
  index,
};

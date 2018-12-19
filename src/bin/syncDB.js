const db = require('../db');
const bulk = require('./dbInit');

module.exports = () => {
  return db.sequelize.sync({}).then(() => {}); // db sync

  // return db.sequelize.sync({ force: true }).then(() => {
  //   bulk.post();
  //   bulk.grade();
  //   bulk.categories();
  // }); //dbsync + db 삭제후 다시 만듬.. 데이터삭제됨 주의..
};

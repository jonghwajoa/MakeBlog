const models = require('../db');

const categoryBulk = [
  {
    title: 'home',
    order: 1,
  },
  {
    title: 'Stack',
    order: 2,
  },
  {
    title: 'Queue',
    order: 3,
  },
  {
    title: 'DP',
    order: 4,
  },
];

const solvingMain = [
  {
    title: '타이틀입니다아아',
    content: ' 콘텐트이니다.!!',
    problemNum: '1',
    url: ' ',
    category_cote_no: '1',
    writer: '1',
  },
];

async function dbInit() {
  try {
    await models.CategoryCote.bulkCreate(categoryBulk);
    await models.Solving.bulkCreate(solvingMain);
  } catch (e) {
    console.error(e);
  }
}

module.exports = dbInit;

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

const category = [
  {
    no: 1,
    explain: 'number1',
  },
  {
    no: 2,
    explain: 'number2',
  },
  {
    no: 3,
    explain: 'number3',
  },
];
const post = [
  {
    title: '1번글 입니다.',
    tag: '#아무거나 #갑시다 #히히',
    content: '1번글 content입니다.',
    category_no: 1,
    writer: 1,
  },
  {
    title: '2번글 입니다.',
    tag: '#아무거나 #갑시다 #히히',
    content: '2번글 content입니다.',
    category_no: 1,
    writer: 1,
  },
  {
    title: '3번글 입니다.',
    tag: '#아무거나 #갑시다 #히히',
    content: '3번글 content입니다.',
    category_no: 1,
    writer: 1,
  },
];

async function dbInit() {
  try {
    await models.Categories.bulkCreate(category);
    await models.Posts.bulkCreate(post);
    await models.CategoryCote.bulkCreate(categoryBulk);
    await models.Solving.bulkCreate(solvingMain);
  } catch (e) {
    console.error(e);
  }
}

module.exports = dbInit;

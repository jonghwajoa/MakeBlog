const bulkCreate = require('./dataBulk');

// TODO
// file 벨리데이션
// 미들웨어, 함수 벨리데이션

describe('테스트 코드 전체 실행.....', () => {
  require('./validation.spec');
  require('./pages/auth.spec');

  require('./pages/posts.spec');
  require('./pages/subpost.spec');

  describe('db createBulk...', () => {
    before(() => {
      bulkCreate();
    });
    require('./pages/solving.spec');
  });
});

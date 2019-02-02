const bulkCreate = require('./dataBulk');

describe('테스트 코드 전체 실행.....', () => {
  require('./validation.spec');
  require('./pages/auth.spec');

  describe('DB초기화...', () => {
    before(() => {
      bulkCreate();
    });

    require('./pages/posts.spec');
    require('./pages/subpost.spec');

    require('./pages/solving.spec');
  });
});

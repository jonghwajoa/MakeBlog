const bulkCreate = require('./dataBulk');

describe('테스트 코드 전체 실행.....', () => {
  require('./validation.spec');
  require('../route/auth/auth.spec');

  describe('DB초기화...', () => {
    before(() => {
      bulkCreate();
    });

    require('../route/post/post.spec');
    require('../route/post/subpost.spec');

    require('../route/solving/solving.spec');
  });
});

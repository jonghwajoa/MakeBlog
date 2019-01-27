const bulkCreate = require('./dataBulk');

describe('테스트 코드 전체 실행.....', () => {
  require('../route/auth/auth.spec');
  require('../route/post/post.spec');
  require('../route/post/subpost.spec');

  describe('후행 실행...', () => {
    before(() => {
      bulkCreate();
    });
    require('../route/solving/solving.spec');
  });
});

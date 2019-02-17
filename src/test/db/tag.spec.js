const should = require('should');
const request = require('supertest');
const app = require('../../app');
const db = require('../../db');

describe('categoryRepository는.......', () => {
  before(() => db.sequelize.sync({ force: true }));

  describe('create는.....', () => {
    it('name이 공백이면 Tags.name cannot be null을 반환한다...', async () => {
      try {
        await db.Tags.create();
      } catch (e) {
        e.errors[0].message.should.be.equal('Tags.name cannot be null');
      }
    });

    it('name이 공백이면 reject를 반환한다....', () => {
      (async () => {
        try {
          await db.Tags.create();
        } catch (e) {
          throw new Error(e.errors[0].message);
        }
      })().should.be.rejectedWith();
    });

    it('성공시 UUID를 반환한다.....', async () => {
      let result;
      try {
        result = await db.Tags.createByName('hehe');
      } catch (e) {
        throw Error(e);
      }
      result.dataValues.should.property('no');
    });

    it('길이가 100이상이면 오류를 반환', async () => {
      let result;

      try {
        result = await db.Tags.createByName('hehe'.repeat(100));
      } catch (e) {
        e.errors[0].message.should.be.equal('Tag 이름의 길이는 1 이상 100 이하 입니다.');
      }
    });
  });

  describe('updateOrCreate는...', () => {
    it('존재하는 tag라면 undefined를 반환한다.....', async () => {
      let result;
      try {
        result = await db.Tags.updateOrCreateByName('hehe');
      } catch (e) {
        console.log(e);
      }
      (result == undefined).should.be.true();
    });

    it('존재하지 않는 태그라면 tag라면 생성한다.....', async () => {
      let result;
      try {
        result = await db.Tags.updateOrCreateByName('gh123aaa');
      } catch (e) {
        console.log(e);
      }
      (result != undefined).should.be.true;
    });
  });
});

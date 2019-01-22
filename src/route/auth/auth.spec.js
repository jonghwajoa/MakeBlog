const should = require('should');
const request = require('supertest');
const app = require('../../app');
const models = require('../../db');

/**
 * Auth는 login, signup, logout을 제공한다.
 */

describe('Auth는..', () => {
  before(() => models.sequelize.sync({ force: true }));

  /** POST /auth/register 는...
   * id : 5 < length < 20
   * pw : 5 < length < 20
   * nickname :  2 < length < 20
   *
   * case success : id반환 및 201 반환
   * case fail : id , pw ,nickname의 길이를 만족하지 않은경우
   **/
  describe('POST /register 회원 가입시...', () => {
    describe('실패시...', () => {
      it('id의 길이가 5이하은 상태코드 400을 반환한다.', done => {
        request(app)
          .post('/auth/register')
          .send({
            id: 'jongh',
            pw: 'jonghwapw',
            nickname: 'babo',
          })
          .expect(400)
          .end(done);
      });

      it('id의 길이가 20이상은 상태코드 400을 반환한다.', done => {
        request(app)
          .post('/auth/register')
          .send({
            id: 'jonghwajonghwajonghw',
            pw: 'jonghwapw',
            nickname: 'babo',
          })
          .expect(400)
          .end(done);
      });

      it('pw의 길이가 5이하는 상태코드 400을 반환한다.', done => {
        request(app)
          .post('/auth/register')
          .send({
            id: 'jonghwa',
            pw: 'jongh',
            nickname: 'babo',
          })
          .expect(400)
          .end(done);
      });

      it('pw의 길이가 20이상은 상태코드 400을 반환한다.', done => {
        request(app)
          .post('/auth/register')
          .send({
            id: 'jonghwa',
            pw: 'jonghwapwjonghwapwjo',
            nickname: 'babo',
          })
          .expect(400)
          .end(done);
      });

      it('nickname의 길이가 2이하는 상태코드 400을 반환한다.', done => {
        request(app)
          .post('/auth/register')
          .send({
            id: 'jonghwa',
            pw: 'jonghwapw',
            nickname: 'ba',
          })
          .expect(400)
          .end(done);
      });
    });

    describe('성공시...', () => {
      it('상태코드 201을 반환한다...', done => {
        request(app)
          .post('/auth/register')
          .send({
            id: 'jonghwa',
            pw: 'jonghwapw',
            nickname: 'babo',
          })
          .expect(201)
          .end((err, res) => {
            res.body.should.have.property('id', 'jonghwa');
            done();
          });
      });
    });
  });

  /** POST /auth/login 로그인시..
   *
   * success :
   * fail : id,pw가 길이제한에 맞지 않는경우
   *        id가 없는경우
   *        pw가 틀린경우
   *  */

  describe('POST /auth/login 로그인시...', () => {
    describe('실패시...', () => {
      it('id의 길이가 5이하인 경우...', done => {
        request(app)
          .post('/auth/login')
          .send({
            id: 'jongh',
            pw: 'jonghgwapw',
          })
          .expect(400)
          .end(done);
      });

      it('id의 길이가 20이상은 상태코드 400을 반환한다.', done => {
        request(app)
          .post('/auth/register')
          .send({
            id: 'jonghwajonghwajonghw',
            pw: 'jonghwapw',
          })
          .expect(400)
          .end(done);
      });

      it('pw의 길이가 5이하는 상태코드 400을 반환한다.', done => {
        request(app)
          .post('/auth/register')
          .send({
            id: 'jonghwa',
            pw: 'jongh',
          })
          .expect(400)
          .end(done);
      });

      it('pw의 길이가 20이상은 상태코드 400을 반환한다.', done => {
        request(app)
          .post('/auth/register')
          .send({
            id: 'jonghwa',
            pw: 'jonghwapwjonghwapwjo',
          })
          .expect(400)
          .end(done);
      });
    });
  });
});

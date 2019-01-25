const should = require('should');
const request = require('supertest');
const app = require('../../app');
const models = require('../../db');

let agent = request.agent(app);

describe('/solving은 *********************', () => {
  /**  GET /solving
   *   success case: 상태코드200과 html을 반환한다.
   *   fail case :
   */
  describe('GET /solving 요청시....', () => {
    describe('성공시....', () => {
      it('상태코드200과 html을 응답한다.', done => {
        request(app)
          .get('/solving')
          .expect(200)
          .expect('Content-Type', /html/)
          .end(done);
      });
    });
  });

  /**  GET /solvie/new
   *   success case: 상태코드200과 html을 반환한다.
   *   fail case : 비로그인 상태요청시 401을 반환한다.
   */
  describe('GET /solving/new 요청시...', () => {
    describe('성공시.....', () => {
      before(done => {
        agent
          .post('/auth/login')
          .send({
            id: 'jonghwa',
            pw: 'jonghwapw',
          })
          .end(done);
      });

      it('성공시 상태코드200과 html을 반환한다.', done => {
        agent
          .get('/solving/new')
          .expect(200)
          .expect('Content-Type', /html/)
          .end(done);
      });
    });
    describe('실패시...', () => {
      it('비로그인시 401과 html을 반환한다.', done => {
        request(app)
          .get('/solving/new')
          .expect(401)
          .expect('Content-Type', /html/)
          .end(done);
      });
    });
  });
});

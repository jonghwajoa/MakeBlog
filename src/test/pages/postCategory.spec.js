const should = require('should');
const request = require('supertest');
const app = require('../../app');

let agent = request.agent(app);
let deleteNo;

/**
 * 파일업로드
 * 카테고리추가
 * 카테고리삭제
 */

describe('/posts/category 는.....', () => {
  before(done => {
    agent
      .post('/auth/login')
      .send({
        id: 'jonghwa',
        pw: 'jonghwapw',
      })
      .end(done);
  });
  /** POST /posts/category
   *  sucess : 201을 응답한다.
   *  fail : 비로그인시 401 , 이미존재하는 경우 400을 응답한다.
   */
  describe('POST /posts/category', () => {
    it('비로그인시 요청시 401을 응답한다...', done => {
      request(app)
        .post('/posts/category')
        .send({
          requestCategoryName: 'name1',
        })
        .expect(401)
        .end(done);
    });

    it('categoryName이 없으면 400을 응답한다.', done => {
      agent
        .post('/posts/category')
        .send({})
        .expect(400)
        .end(done);
    });

    it('이미 존재하는 categoryName이면 400을 응답한다.', done => {
      agent
        .post('/posts/category')
        .send({
          requestCategoryName: 'name1',
        })
        .expect(400)
        .end(done);
    });

    it('성공시 201과 no를 JSON으로 응답한다. ', done => {
      agent
        .post('/posts/category')
        .send({
          requestCategoryName: 'name112',
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          res.body.should.property('no');
          deleteNo = res.body.no;
          done();
        });
    });
  });

  describe('DELETE /posts/category/:id는 ....', () => {
    it('비로그인시 요청시 401을 응답한다...', done => {
      request(app)
        .delete('/posts/category/')
        .send({
          id: deleteNo,
        })
        .expect(401)
        .end(done);
    });

    describe('로그인 상태에서.....', () => {
      it('없는 id 요청시 404를 반환한다...', done => {
        agent
          .delete('/posts/category/543543534')
          .expect(404)
          .end(done);
      });

      it('삭제 성공시 204를 응답한다...', done => {
        agent
          .delete(`/posts/category/${deleteNo}`)
          .expect(204)
          .end(done);
      });
    });
  });

  describe('POST /posts/file 요청시...', () => {
    it('비로그인으로 요청시 401을 반환한다..', done => {
      request(app)
        .post('/posts/file')
        .expect(401)
        .end(done);
    });
  });
});

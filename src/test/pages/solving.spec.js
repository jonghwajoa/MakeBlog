const should = require('should');
const request = require('supertest');
const app = require('../../app');
const models = require('../../db');

let agent = request.agent(app);
let deleteNo, categoryDeleteNo;

/**
 * 리스트
 * 생성뷰
 * 생성
 * 보기
 * 업데이트 뷰
 * 업데이트
 * 삭제하기
 */

describe('/solving은 *********************', () => {
  before(done => {
    agent
      .post('/auth/login')
      .send({
        id: 'jonghwa',
        pw: 'jonghwapw',
      })
      .end(done);
  });

  /**  GET /solving
   *   success case: 상태코드200과 html을 반환한다.
   *                  json 요청시 json으로 응답한다.
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

  /**  POST /solving
   *   success : 201과 생성된 no값을 반환한다.
   *   fail : 입력값 오류시 400반환
   *          인증없을시 401을 반환한다.
   */
  describe('POST /solving 요청시...', () => {
    describe('실패시.....', () => {
      it('비로그인시 401을과 json을 응답한다.', done => {
        request(app)
          .post('/solving')
          .send({
            title: '타이틀입니다.',
            content: '컨텐츠입니다.',
            category: '1',
            url: ' ',
            problemNum: '11252',
          })
          .expect(401)
          .expect('Content-Type', /json/)
          .end(done);
      });

      it('title이 null이면 400을 반환한다.', done => {
        agent
          .post('/solving')
          .send({
            title: null,
            content: '컨텐츠입니다.',
            category: '1',
            url: ' ',
            problemNum: '11252',
          })
          .expect(400)
          .expect('Content-Type', /json/)
          .end(done);
      });

      it('content null이면 400을 반환한다.', done => {
        agent
          .post('/solving')
          .send({
            title: '타이틀 입니다.',
            content: null,
            category: '1',
            url: ' ',
            problemNum: '11252',
          })
          .expect(400)
          .expect('Content-Type', /json/)
          .end(done);
      });

      it('category가 null이면 400을 반환한다.', done => {
        agent
          .post('/solving')
          .send({
            title: '타이틀 입니다.',
            content: '컨텐츠입니다.',
            category: null,
            url: ' ',
            problemNum: '11252',
          })
          .expect(400)
          .expect('Content-Type', /json/)
          .end(done);
      });

      it('problemNum null이면 400을 반환한다.', done => {
        agent
          .post('/solving')
          .send({
            title: '타이틀 입니다.',
            content: '컨텐츠입니다.',
            category: '1',
            url: ' ',
            problemNum: null,
          })
          .expect(400)
          .expect('Content-Type', /json/)
          .end(done);
      });
    });

    // problemNum이 기본키이기 때문에 전체 테스트에서만 실행
    describe('성공시....', () => {
      it('201을 반환한다..', done => {
        agent
          .post('/solving')
          .send({
            title: '타이틀 입니다.',
            content: '컨텐츠입니다.',
            category: '1',
            url: ' ',
            problemNum: '5555',
          })
          .expect(201)
          .end((err, res) => {
            res.status.should.be.exactly(201);
            deleteNo = res.body.no;
            done();
          });
      });
    });
  });

  /**  GET /solving/:id
   *   success : 로그인시 200과 html을 응답한다.
   *             json 요청시 json으로 응답한다.
   *   fail: 없는 id를 줄경우 404 page 반환한다
   */

  describe('GET /solving/:id', () => {
    describe('성공시...', () => {
      it('URL 요청시 상태코드 200과 html을 반환한다.', done => {
        request(app)
          .get('/solving/1')
          .expect(200)
          .expect('Content-Type', /html/)
          .end(done);
      });

      it('json 요청시 상태코드 200과 json 반환한다.', done => {
        request(app)
          .get('/solving/1')
          .send({ problemNum: '1' })
          .expect(200)
          .expect('Content-Type', /json/)
          .end(done);
      });
    });
    describe('실패시....', () => {
      it('없는 id요청시 404 페이지를 반환한다....', done => {
        request(app)
          .get('/solving/asdlqwd532')
          .expect(404)
          .expect('Content-Type', /html/)
          .end(done);
      });

      it('없는 id요청시를 json으로 요청시  404를 json으로 반환한다....', done => {
        request(app)
          .get('/solving/asdlqwd532')
          .send({})
          .expect(404)
          .expect('Content-Type', /json/)
          .end(done);
      });
    });
  });

  describe('GET /solving/:id/edit', () => {
    describe('실패시....', () => {
      it('비로그인시 401과 html페이지를 반환한다', done => {
        request(app)
          .get('/solving/1/edit')
          .expect(401)
          .expect('Content-Type', /html/)
          .end(done);
      });

      it('없는 id일 경우 404를 반환한다...', done => {
        agent
          .get('/solving/dqvfwe/edit')
          .expect(404)
          .expect('Content-Type', /html/)
          .end(done);
      });

      it('성공시 200과 html을 반환한다..', done => {
        agent
          .get('/solving/1/edit')
          .expect(200)
          .expect('Content-Type', /html/)
          .end(done);
      });
    });
  });

  /**  PUT /solving
   *   fail case : 누락값 존재시 400 반환
   *                비로그인시 401을 응답한다.
   *   success : 204와 json타입으로 응답한다.
   */
  describe('PUT /solving', () => {
    describe('실패시....', () => {
      it('비로그인시 401로 응답한다...', done => {
        request(app)
          .put('/solving')
          .send({})
          .expect(401)
          .end(done);
      });

      it('title이 null이면 400을 반환한다.', done => {
        agent
          .put('/solving')
          .send({
            title: null,
            content: '컨텐츠입니다.',
            category: '1',
            url: ' ',
            problemNum: '11252',
          })
          .expect(400)
          .expect('Content-Type', /json/)
          .end(done);
      });

      it('content null이면 400을 반환한다.', done => {
        agent
          .put('/solving')
          .send({
            title: '타이틀 입니다.',
            content: null,
            category: '1',
            url: ' ',
            problemNum: '11252',
          })
          .expect(400)
          .expect('Content-Type', /json/)
          .end(done);
      });

      it('category가 null이면 400을 반환한다.', done => {
        agent
          .put('/solving')
          .send({
            title: '타이틀 입니다.',
            content: '컨텐츠입니다.',
            category: null,
            url: ' ',
            problemNum: '11252',
          })
          .expect(400)
          .expect('Content-Type', /json/)
          .end(done);
      });
    });

    describe('성공시....', () => {
      it('성공시 204을 응답한다.', done => {
        agent
          .put('/solving')
          .send({
            title: '타이틀 입니다.',
            content: '컨텐츠입니다.',
            category: '1',
            url: ' ',
            problemNum: '1',
          })
          .expect(204)
          .end(done);
      });
    });
  });

  describe('DELETE /solving/:id', () => {
    it('비로그인시 401을 반환한다...', done => {
      request(app)
        .delete('/solving/5555')
        .expect(401)
        .end(done);
    });

    it('없는 no면 404를 반환한다....', done => {
      agent
        .delete(`/solving/9999556`)
        .expect(404)
        .end(done);
    });

    it('삭제 성공시 204를 응답한다....', done => {
      agent
        .delete(`/solving/${deleteNo}`)
        .expect(204)
        .end(done);
    });
  });

  describe('Solving Category 관련....', () => {
    describe('POST /solving/category', () => {
      it('성공시 201과 no를 JSON으로 응답한다. ', done => {
        agent
          .post('/solving/category')
          .send({
            requestCategoryName: 'name1',
          })
          .expect(200)
          .expect('Content-Type', /json/)
          .end((err, res) => {
            res.body.should.property('no');
            categoryDeleteNo = res.body.no;
            done();
          });
      });

      it('비로그인시 요청시 401을 응답한다...', done => {
        request(app)
          .post('/solving/category')
          .send({
            requestCategoryName: 'name1',
          })
          .expect(401)
          .end(done);
      });

      it('categoryName이 없으면 400을 응답한다.', done => {
        agent
          .post('/solving/category')
          .send({})
          .expect(400)
          .end(done);
      });

      it('이미 존재하는 categoryName이면 400을 응답한다.', done => {
        agent
          .post('/solving/category')
          .send({
            requestCategoryName: 'name1',
          })
          .expect(400)
          .end(done);
      });
    });

    describe('DELETE /posts/category/:id는 ....', () => {
      it('비로그인시 요청시 401을 응답한다...', done => {
        request(app)
          .delete(`/solving/category/${categoryDeleteNo}`)
          .expect(401)
          .end(done);
      });

      describe('로그인 상태에서.....', () => {
        it('없는 id 요청시 404를 반환한다...', done => {
          agent
            .delete('/solving/category/543543534')
            .expect(404)
            .end(done);
        });

        it('삭제 성공시 204를 응답한다...', done => {
          agent
            .delete(`/solving/category/${categoryDeleteNo}`)
            .expect(204)
            .end(done);
        });
      });
    });
  });
});

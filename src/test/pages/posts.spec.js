const should = require('should');
const request = require('supertest');
const app = require('../../app');
const models = require('../../db');

const WritePostVal = {
  title: '5번글 입니다.',
  tag: '#아무거나 #갑시다 #히히',
  content: '1번글 content입니다.',
  category_no: 5,
  writer: 5,
};

let deleteNo;

/** 테스트 케이스
 * 생성뷰
 * 서브생성뷰
 * 글등록
 * 리스트
 * 글보기
 * 업데이트뷰
 * 업데이터
 * 제거
 */

let agent = request.agent(app);

describe('/Posts는********************************', () => {
  before(done => {
    agent
      .post('/auth/login')
      .send({
        id: 'jonghwa',
        pw: 'jonghwapw',
      })
      .end(done);
  });

  describe('GET / 요청시.....', () => {
    let body;
    it('302와 반환한다.', done => {
      request(app)
        .get('/')
        .expect(302)
        .end((err, res) => {
          res.header.should.have.property('location', '/posts');
          done();
        });
    });
  });

  /** GET /posts
   *  success : html과 200을 반환한다.
   */
  describe('GET /posts 요청시.....', () => {
    it('비로그인시 list page html로 200을 응답한다.', done => {
      request(app)
        .get('/posts')
        .expect('Content-Type', /html/)
        .expect(200)
        .end((err, res) => {
          body = res.body;
          done();
        });
    });

    it('로그인하고 list page요청시 html로 200을 응답한다.', done => {
      agent
        .get('/posts')
        .expect(200)
        .expect('Content-Type', /html/)
        .end(done);
    });

    it('page가 자연수가 아니면 400을 반환한다.', done => {
      request(app)
        .get('/posts?page=-1')
        .expect('Content-Type', /html/)
        .expect(400)
        .end((err, res) => {
          body = res.body;
          done();
        });
    });

    it('page가 자연수가 아니면 400을 반환한다.', done => {
      request(app)
        .get('/posts?page=dasa')
        .expect('Content-Type', /html/)
        .expect(400)
        .end((err, res) => {
          body = res.body;
          done();
        });
    });
  });

  /** GET /posts/new
   * success : 로그인 상태에서 html과 200을 응답한다.
   * fail : 비로그인 상태 401을 반환한다.
   */
  describe('GET /posts/new 요청시...', () => {
    describe('실패시...', () => {
      it('비로그인상태에서 401과 html을 반환한다.', done => {
        request(app)
          .get('/posts/new')
          .expect('Content-Type', /html/)
          .expect(401)
          .end(done);
      });

      it('비로그인 상태에서 JSON으로 요청하면 401과 JSON을 응답한다.', done => {
        request(app)
          .get('/posts/new')
          .expect(401)
          .expect('Content-Type', /json/)
          .send({})
          .end(done);
      });
    });

    describe('성공시...', () => {
      it('로그인 상태에서 200과 html을 반환한다.', done => {
        agent
          .get('/posts/new')
          .expect(200)
          .expect('Content-Type', /html/)
          .end(done);
      });
    });
  });

  /** GET /posts/:id
   *  success : 200으로 html을 반환한다. ,, JSON으로 요청한경우 JSON으로 응답한다
   *  fail : id는 자연수, 존재해야하는 자원
   */
  describe('GET /posts/:id', () => {
    describe('비로그인 상태에서....', () => {
      describe('실패시...', () => {
        describe('url로 요청한경우', () => {
          it('id가 자연수 아닌경우 400으로 응답한다', done => {
            request(app)
              .get('/posts/a')
              .expect(400)
              .end(done);
          });

          it('id가 자연수 아닌경우 400으로 응답한다', done => {
            request(app)
              .get('/posts/-')
              .expect(400)
              .end(done);
          });

          it('id가 음수인경우 400로 응답한다.', done => {
            request(app)
              .get('/posts/-10000')
              .expect(400)
              .end(done);
          });

          it('id가 0 인경우 400로 응답한다.', done => {
            request(app)
              .get('/posts/0')
              .expect(400)
              .end(done);
          });

          it('id가 없을경우 404로 응답한다.', done => {
            request(app)
              .get('/posts/99999')
              .expect(404)
              .end(done);
          });
        });

        describe('JSON으로 요청한경우', () => {
          it('id가 없을 경우 상태코드404과 JSON 을 응답한다.', done => {
            request(app)
              .get('/posts/6688')
              .send({})
              .expect(404)
              .expect('Content-Type', /json/)
              .end(done);
          });

          it('id가 자연수가 아닌경우 400을 응답한다', done => {
            request(app)
              .get('/posts/-1')
              .send({})
              .expect(400)
              .expect('Content-Type', /json/)
              .end(done);
          });
        });
      });

      describe('성공시....', () => {
        describe('url로 요청한경우', () => {
          it('상태코드200과 html을 반환한다.', done => {
            request(app)
              .get('/posts/1')
              .expect(200)
              .expect('Content-Type', /html/)
              .end(done);
          });
        });

        describe('JSON으로 요청한경우', () => {
          let body;
          before(done => {
            request(app)
              .get('/posts/1')
              .send({})
              .expect(200)
              .expect('Content-Type', /json/)
              .end((err, res) => {
                body = res.body.post;
                done();
              });
          });

          it('상태코드200과 JSON 을 응답한다.', done => {
            request(app)
              .get('/posts/1')
              .send({})
              .expect(200)
              .expect('Content-Type', /json/)
              .end(done);
          });

          it('입력한 id에 대응하는 Post 리소스를 응답한다.', () => {
            body.should.properties(['no', 'title', 'content', 'count']);
          });

          it('id에 대한 no를 반환한다', () => {
            body.should.property('no', 1);
          });
        });
      });
    });
  });

  /** POST /posts/ 요청시
   * case success : 로그인상태
   * case fail : 비로그인, title,tag,content,category 누락
   */
  describe('POST /posts/ 요청시....', () => {
    describe('비로그인 상태에서...', () => {
      it('권한없음 401과 unauthorized 반환한다.', done => {
        request(app)
          .post('/posts')
          .send(WritePostVal)
          .expect(401)
          .expect('Content-Type', /json/)
          .end((err, res) => {
            res.body.should.property('message', 'UnAuthorized');
            done();
          });
      });
    });

    describe('로그인 상태에서...', () => {
      describe('실패시...', () => {
        it('모든 입력값은 String이지 않으면 400을 반환한다.', done => {
          agent
            .post('/posts')
            .send({
              title: '5번',
              tag: '#아무거나 #갑시다 #히히',
              content: '1번글 content입니다.',
              category: 1,
            })
            .expect(400)
            .expect('Content-Type', /json/)
            .end(done);
        });

        it('title 누락시 400을 반환', done => {
          agent
            .post('/posts')
            .send({
              tag: '#아무거나 #갑시다 #히히',
              content: '1번글 content입니다.',
              category: '1',
            })
            .expect(400)
            .expect('Content-Type', /json/)
            .end(done);
        });

        it('tag 누락시 400을 반환', done => {
          agent
            .post('/posts')
            .send({
              title: '5번',
              content: '1번글 content입니다.',
              category: '1',
            })
            .expect(400)
            .expect('Content-Type', /json/)
            .end(done);
        });

        it('cotent 누락시 400을 반환', done => {
          agent
            .post('/posts')
            .send({
              title: '5번',
              tag: '#아무거나 #갑시다 #히히',
              category: '1',
            })
            .expect(400)
            .expect('Content-Type', /json/)
            .end(done);
        });

        describe('성공시...', () => {
          let body;
          it('201을 Json 타입을 반환한다.', done => {
            agent
              .post('/posts')
              .send({
                title: '5번입니다하하',
                tag: '#아무거나 #갑시다 #히히',
                content: '1번글 content입니다.',
                category: '1',
              })
              .expect(201)
              .expect('Content-Type', /json/)
              .end((err, res) => {
                body = res.body;
                deleteNo = body.no;
                done();
              });
          });

          it('생성된 포스트의 no를 반환한다.', () => {
            body.should.have.property('no');
          });
        });
      });
    });
  });

  /** GET /posts/:id/edit
   *  success : 200과 html을 반환한다.
   *  fail : 비로그인상태, id가 자연수가 아닌경우, id가 없는경우
   */
  describe('GET /posts/:id/edit 요청시...', () => {
    describe('비로그인 상태에서....', () => {
      it('세션이 없다면 401과 html을 응답한다...', done => {
        request(app)
          .get('/posts/1/edit')
          .expect(401)
          .expect('Content-Type', /html/)
          .end(done);
      });
    });
    describe('로그인 상태에서....', () => {
      describe('실패시....', () => {
        it('id값이 자연수가 아닌경우 400, html 반환한다.', done => {
          agent
            .get('/posts/a/edit')
            .expect(400)
            .expect('Content-Type', /html/)
            .end(done);
        });

        it('존재하지 않는 id값 이라면 404를 반환한다.', done => {
          agent
            .get('/posts/79999/edit')
            .expect(404)
            .expect('Content-Type', /html/)
            .end(done);
        });
      });

      describe('성공시....', () => {
        it('성공시 200과 html을 반환한다.', done => {
          agent
            .get('/posts/1/edit')
            .expect(200)
            .expect('Content-Type', /html/)
            .end(done);
        });
      });
    });
  });

  /** PUT /posts/:id
   *  success :
   *  fail : 비로그인, id가 자연수가 아닌경우, 없는 리소스
   *
   */
  describe('PUT /posts/:id 요청시...', () => {
    describe('비로그인 상태에서...', () => {
      it('401과 html을 응답한다.', done => {
        request(app)
          .get('/posts/1/new')
          .expect('Content-Type', /html/)
          .expect(401)
          .end(done);
      });
    });

    describe('로그인 상태에서...', () => {
      describe('실패시...', () => {
        it('id값이 자연수가 아닌경우 400, html 반환한다.', done => {
          agent
            .put('/posts/a')
            .expect(400)
            .expect('Content-Type', /html/)
            .end(done);
        });

        it('모든 입력값은 String이지 않으면 400을 반환한다.', done => {
          agent
            .put('/posts/1')
            .send({
              title: '5번',
              tag: '#아무거나 #갑시다 #히히',
              content: '1번글 content입니다.',
              category: 1,
            })
            .expect(400)
            .expect('Content-Type', /json/)
            .end(done);
        });

        it('title 누락시 400을 반환', done => {
          agent
            .put('/posts/1')
            .send({
              tag: '#아무거나 #갑시다 #히히',
              content: '1번글 content입니다.',
              category: '1',
            })
            .expect(400)
            .expect('Content-Type', /json/)
            .end(done);
        });

        it('tag 누락시 400을 반환', done => {
          agent
            .put('/posts/1')
            .send({
              title: '5번',
              content: '1번글 content입니다.',
              category: '1',
            })
            .expect(400)
            .expect('Content-Type', /json/)
            .end(done);
        });

        it('cotent 누락시 400을 반환', done => {
          agent
            .put('/posts/1')
            .send({
              title: '5번',
              tag: '#아무거나 #갑시다 #히히',
              category: '1',
            })
            .expect(400)
            .expect('Content-Type', /json/)
            .end(done);
        });

        it('존재하지 않는 id 입력시 404를 응답한다....', done => {
          agent
            .put('/posts/999999999')
            .send({
              title: '5번',
              tag: '#수정 #성공 #합시다.',
              content: '1번글 content입니다.',
              category: '1',
            })
            .expect(404)
            .end(done);
        });
      });

      describe('성공시...', () => {
        it('204를 반환한다...', done => {
          agent
            .put('/posts/1')
            .send({
              title: '5번',
              tag: '#수정 #성공 #합시다.',
              content: '1번글 content입니다.',
              category: '1',
            })
            .expect(204)
            .end(done);
        });
      });
    });
  });

  /** DELETE /posts/:id
   *  success : 204를 응답한다.
   *  fail : 비로그인시, 아이디가 자연수가 아닌경우, 아이디가 없는경우
   */
  describe('DELETE /posts/:id 요청시...', () => {
    describe('비로그인시...', () => {
      it('세션이 없으면 401과 json을 반환한다.', done => {
        request(app)
          .delete('/posts/5')
          .send({})
          .expect(401)
          .expect('Content-Type', /json/)
          .end(done);
      });
    });

    describe('로그인 상태에서...', () => {
      describe('실패시...', () => {
        it('id값이 자연수가 아닌경우 400, html 반환한다.', done => {
          agent
            .delete('/posts/a')
            .expect(400)
            .expect('Content-Type', /html/)
            .end(done);
        });

        it('id값이 없는경우 404과 html을 반환한다.', done => {
          agent
            .delete('/posts/999999')
            .expect(404)
            .expect('Content-Type', /html/)
            .end(done);
        });

        it('id값이 없고 JSON으로 요청한경우 404, json 반환한다.', done => {
          agent
            .delete('/posts/999999')
            .send({})
            .expect(404)
            .expect('Content-Type', /json/)
            .end(done);
        });
      });
      describe('성공시...', () => {
        it('204를 응답한다..', done => {
          agent
            .delete(`/posts/${deleteNo}`)
            .expect(204)
            .end(done);
        });
      });
    });
  });
});

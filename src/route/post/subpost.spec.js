const should = require('should');
const request = require('supertest');
const app = require('../../app');

/**
 * 서브글등록view
 * 서브글등록
 * 서브글보기
 * 서브업데이터view
 * 서브업데이터
 * 서브글제거
 * 파일업로드
 * 카테고리추가
 */

const writePost = {
  title: '제목입니다',
  content: '내용물입니다 ^_^',
};

describe('/Post의 subPost는......', () => {
  let agent = request.agent(app);
  /** GET /post/:id/new 요청시
   *  case success : 로그인상태, post id가 존재
   *  case fail : 비로그인 상태, post id가 비존재
   */
  describe('GET /post/:id/new 요청시....', () => {
    describe('비로그인 상태에서...', () => {
      describe('실패시...', () => {
        it('401과 html을 응답한다.', done => {
          request(app)
            .get('/post/1/new')
            .expect('Content-Type', /html/)
            .expect(401)
            .end(done);
        });

        it('JSON으로 요청하면 401과 JSON을 응답한다.', done => {
          request(app)
            .get('/post/1/new')
            .expect(401)
            .expect('Content-Type', /json/)
            .send({})
            .end(done);
        });
      });
      describe('로그인 상태에서....', () => {
        before(done => {
          agent
            .post('/auth/login')
            .send({
              id: 'jonghwa',
              pw: 'jonghwapw',
            })
            .end(done);
        });
        describe('실패시...', () => {
          it('포스트글이 없다면 404를 반환한다..', done => {
            agent
              .get('/post/99999/new')
              .expect(404)
              .end(done);
          });

          it('포스트no가 자연수가 아니라면 400을 반환한다..', done => {
            agent
              .get('/post/-1/new')
              .expect(400)
              .end(done);
          });

          it('포스트no가 자연수가 아니라면 400을 반환한다..', done => {
            agent
              .get('/post/0/new')
              .expect(400)
              .end(done);
          });

          it('포스트no가 자연수가 아니라면 400을 반환한다..', done => {
            agent
              .get('/post/ㅁㅇㄴㄴㅁ/new')
              .expect(400)
              .end(done);
          });
        });

        describe('성공시....', () => {
          it('200과 html을 반환한다..', done => {
            agent
              .get('/post/1/new')
              .expect(200)
              .expect('Content-Type', /html/)
              .end(done);
          });
        });
      });
    });
  });

  /**  POST /post/:id
   *   success : 201과 생성된 포스트와 & json타입을 반환한다.
   *   fail : 비로그인시 401, 입력값 검증실패: 400
   */
  describe('POST /post/:id 서브글 등록시...', () => {
    describe('비로그인 상태에서....', () => {
      it('401과 json을 반환한다.', done => {
        request(app)
          .post('/post/1/')
          .send(writePost)
          .expect(401)
          .expect('Content-Type', /json/)
          .end((err, res) => {
            let result = JSON.parse(res.text);
            result.should.have.property('message', 'UnAuthorized');
            done();
          });
      });
    });

    describe('로그인 상태에서....', () => {
      describe('실패시....', () => {
        it('title 누락시 400을 반환', done => {
          agent
            .post('/post/1/')
            .send({
              content: 'sub content입니다.',
            })
            .expect(400)
            .expect('Content-Type', /json/)
            .end(done);
        });

        it('content 누락시 400을 반환', done => {
          agent
            .post('/post/1')
            .send({
              title: 'subpost title입니다.',
            })
            .expect(400)
            .expect('Content-Type', /json/)
            .end(done);
        });

        it('없는 포스트일경우 404를 반환한다.', done => {
          agent
            .post('/post/99594')
            .send({
              title: 'subpost title입니다.',
              content: 'subpost content입니다',
            })
            .expect(404)
            .expect('Content-Type', /json/)
            .end(done);
        });

        it('id가 자연수가 아닌경우 400을 반환한다.', done => {
          agent
            .post('/post/ㅁㅁㅁㅇㄴ')
            .send({
              title: 'subpost title입니다.',
              content: 'subpost content입니다',
            })
            .expect(400)
            .expect('Content-Type', /json/)
            .end(done);
        });
      });

      describe('성공시.....', () => {
        let result;
        it('201과 생성된 포스트 내용을 응답한다.', done => {
          agent
            .post('/post/1')
            .send({
              title: 'subpost title입니다.',
              content: 'subpost content입니다',
            })
            .expect(201)
            .expect('Content-Type', /json/)
            .end((err, res) => {
              result = res.body;
              done();
            });
        });

        it('응답 내용에는 no가 반드시 포함되어 있어야 한다...', () => {
          result.should.have.property('no');
        });

        it('요청 title과 content는 응답과 같아야 한다...', () => {
          result.title.should.be.eql('subpost title입니다.');
          result.content.should.be.eql('subpost content입니다');
        });

        it('요청 postNo와 응답 postNo가 같아야 한다.', () => {
          result.post_no.should.be.eql('1');
        });
      });
    });
  });

  describe('GET /post/:id/:subId 요청시.....', () => {
    describe('URL 요청시...', () => {
      describe('실패시....', () => {
        it('id는 자연수가 아니면 400을 응답한다.', done => {
          request(app)
            .get('/post/a/1')
            .expect(400)
            .end(done);
        });

        it('subId는 자연수가 아니면 400을 응답한다.', done => {
          request(app)
            .get('/post/1/d')
            .expect(400)
            .end(done);
        });

        it('postId가 존재하지 않으면 404를 응답한다..', done => {
          request(app)
            .get('/post/10000/1')
            .expect(404)
            .end(done);
        });

        it('subID가 존재하지 않으면 404를 응답한다..', done => {
          request(app)
            .get('/post/1/10000')
            .expect(404)
            .end(done);
        });
      });
    });
  });
});

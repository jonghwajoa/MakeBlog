const should = require('should');
const request = require('supertest');
const app = require('../../app');
const models = require('../../db');

let agent = request.agent(app);

const categoryBulk = [
  {
    title: 'Stack',
    order: 1,
  },
  {
    title: 'Queue',
    order: 2,
  },
  {
    title: 'DP',
    order: 3,
  },
];

const solvingMain = [
  {
    title: '타이틀입니다아아',
    content: ' 콘텐트이니다.!!',
    problemNum: 'Main',
    url: ' ',
    category_cote_no: '1',
    writer: '1',
  },
];

async function dbInit() {
  try {
    await models.CategoryCote.bulkCreate(categoryBulk);
    await models.Solving.bulkCreate(solvingMain);
  } catch (e) {
    console.log(e);
  }
}

let deleteNo;

describe('/solving은 *********************', () => {
  before(done => {
    dbInit();
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
            resource: '11252',
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
            resource: '11252',
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
            resource: '11252',
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
            resource: '11252',
          })
          .expect(400)
          .expect('Content-Type', /json/)
          .end(done);
      });

      it('resource가 null이면 400을 반환한다.', done => {
        agent
          .post('/solving')
          .send({
            title: '타이틀 입니다.',
            content: '컨텐츠입니다.',
            category: '1',
            resource: null,
          })
          .expect(400)
          .expect('Content-Type', /json/)
          .end(done);
      });
    });

    describe('성공시....', () => {
      let body;
      it('400을 응답한다....', done => {
        agent
          .post('/solving')
          .send({
            title: '타이틀 입니다.',
            content: '컨텐츠입니다.',
            category: '1',
            problemNum: '111155',
            writer: '1',
          })
          .expect('Content-Type', /html/)
          .end((err, res) => {
            body = res.body;
            deleteNo = body.no;
            done();
          });
      });

      it('생성된 포스트의 no를 반환한다.', () => {
        console.log(body);
        body.should.have.property('no');
      });
    });
  });
});

const should = require('should');
const request = require('supertest');
const app = require('../../app');
const models = require('../../db');

describe('/api/admin 는....', () => {
  let agent = request.agent(app);
  before(done => {
    agent
      .post('/auth/login')
      .send({
        id: 'jonghwa',
        pw: 'jonghwapw',
      })
      .end(done);
  });

  describe('/api/admin/daily는....', () => {
    it('비로그인시 401을 응답한다.', done => {
      request(app)
        .get('/api/admin/daily')
        .accept('application/json')
        .expect('Content-Type', /json/)
        .expect(401)
        .end(done);
    });

    it('year, month 정상 요청시..', done => {
      agent
        .get('/api/admin/daily?year=2019&month=3')
        .accept('application/json')
        .expect(200)
        .end((err, res) => {
          res.body.should.have.properties('day', 'count');
          done();
        });
    });

    it('year 4자리 보다 클경우', done => {
      agent
        .get('/api/admin/daily?year=20119&month=3')
        .accept('application/json')
        .expect(400)
        .end(done);
    });

    it('year 4자리 보다 작을경우', done => {
      agent
        .get('/api/admin/daily?year=219&month=3')
        .accept('application/json')
        .expect(400)
        .end(done);
    });

    it('month의 값이 1보다 작을경우', done => {
      agent
        .get('/api/admin/daily?year=219&month=0')
        .accept('application/json')
        .expect(400)
        .end(done);
    });

    it('month의 값이 12보다 작을경우', done => {
      agent
        .get('/api/admin/daily?year=219&month=13')
        .accept('application/json')
        .expect(400)
        .end(done);
    });

    it('year 누락시 요청시..', done => {
      agent
        .get('/api/admin/daily?month=3')
        .accept('application/json')
        .expect(400)
        .end(done);
    });

    it('month 누락시 요청시..', done => {
      agent
        .get('/api/admin/daily?year=2015')
        .accept('application/json')
        .expect(400)
        .end(done);
    });

    it('query 누락시 누락시 요청시..', done => {
      agent
        .get('/api/admin/daily')
        .accept('application/json')
        .expect(400)
        .end(done);
    });
  });

  describe('/api/admin/monthly는....', () => {
    it('query 누락 요청시..', done => {
      agent
        .get('/api/admin/monthly')
        .accept('application/json')
        .expect(400)
        .end(done);
    });

    it('query 정상 요청시..', done => {
      agent
        .get('/api/admin/monthly?year=2019')
        .accept('application/json')
        .expect(200)
        .end((err, res) => {
          res.body.should.have.properties('month', 'count');
          done();
        });
    });

    it('잘못된 year 요청시..', done => {
      agent
        .get('/api/admin/monthly?year=201')
        .accept('application/json')
        .expect(400)
        .end(done);
    });

    it('잘못된 year 요청시..', done => {
      agent
        .get('/api/admin/monthly?year=20221')
        .accept('application/json')
        .expect(400)
        .end(done);
    });
  });
});

const should = require('should');

const {
  arrayElementIsString,
  isLength,
  isUINT,
  postValidation,
  subPostValidation,
  solvingValidation,
  postValidationV2,
} = require('../lib/validation');

const content = 'content 입니다..';
const tag = '#헤헤 #호호';
const category = '1';
const title = 'title입니다.';
const url = 'www';
const tags = ['태그1', '태그2', ' 태그3', '  태그4  '];

describe('벨리데이션 함수 검증테스트......', () => {
  describe('arrayElementIsString 함수는...', () => {
    it('요소가 string이 아니라면 false를 응답한다..', () => {
      arrayElementIsString([1, 'a']).should.be.false();
    });

    it('요소가 없다면,배열이 아니라면 false를 응답한다...', () => {
      arrayElementIsString().should.be.false();
    });

    it('요소가 모두 배열이 아니라면 false를 응답한다...', () => {
      arrayElementIsString({ case1: '1', case2: '2' }).should.be.false();
    });

    it('요소가 모두 string이라면 true를 응답한다...', () => {
      arrayElementIsString(['1', 'asdqwdqw', 'content']).should.be.true();
    });
  });

  describe('isLength 함수는....', () => {
    let caseOne = 'abcde';
    it('input이 min값보다 작으면 false를 응답한다.', () => {
      isLength(caseOne, 10).should.be.false();
    });

    it('input이 min값보다 크면 true를 응답한다.', () => {
      isLength(caseOne, 3).should.be.true();
    });

    it('input값이 max값보다 크면 false를 응답한다..', () => {
      isLength(caseOne, 1, 3).should.be.false();
    });

    it('input값이 min값보다 크고 max값보다 작으면 true를 응답한다...', () => {
      isLength(caseOne, 1, 20).should.be.true();
    });

    it('min > max값을 입력하면 값을 교환해서 비교한다..', () => {
      isLength(caseOne, 20, 1).should.be.true();
    });

    it('min > max값을 입력하면 값을 교환해서 비교한다..', () => {
      isLength(caseOne, 3, 1).should.be.false();
    });
  });

  describe('isUINT 함수는 ......', () => {
    it('0이하를 입력하면 false를 응답한다...', () => {
      isUINT(-1).should.be.false();
      isUINT(0).should.be.false();
    });

    it('String을 입력하면 false를 응답한다...', () => {
      isUINT('testCase').should.be.false();
    });

    it('1이상을 입력하면 true를 응답한다...', () => {
      isUINT(1).should.be.true();
      isUINT(1000).should.be.true();
      isUINT(321124).should.be.true();
      isUINT(+845451).should.be.true();
    });
  });

  describe('postValidation 함수는 ....', () => {
    it('content의 값이 공백이면 false를 응답한다..', () => {
      postValidation({ title, tag, content: '   ', category }).should.be.false();
      postValidation({ title, tag, content: '', category }).should.be.false();
    });

    it('content의 값이 없다면 false를 응답한다..', () => {
      postValidation({ tag, content, category }).should.be.false();
    });

    it('tag의 값이 없다면 false를 응답한다..', () => {
      postValidation({ title, content, category }).should.be.false();
    });

    it('content의 값이 없다면 false를 응답한다..', () => {
      postValidation({ title, tag, category }).should.be.false();
    });

    it('category의 값이 없다면 false를 응답한다..', () => {
      postValidation({ title, tag, content }).should.be.false();
    });

    it('title의 길이가 100이 넘으면 false를 응답한다.', () => {
      postValidation({ title: 'testval'.repeat(100), tag, content, category }).should.be.false();
    });

    it('tag의 길이가 100이 넘으면 false를 응답한다.', () => {
      postValidation({ title, tag: 'tag'.repeat(100), content, category }).should.be.false();
    });

    it('tag맨 앞글자가 #이 아니라면 false르 응답한다....', () => {
      postValidation({ title, tag: 'dadqw #dqdqw #dqwd', content, category }).should.be.false();
      postValidation({ title, tag: 'dadqw', content, category }).should.be.false();
      postValidation({ title, tag: '#dadqw dqwdqw', content, category }).should.be.false();
    });

    it('tag 형식이 맞다면 true를 응답한다.', () => {
      postValidation({ title, tag: '#dadqw #dqdqw #dqwd', content, category }).should.be.true();
      postValidation({ title, tag: '#dadqw', content, category }).should.be.true();
    });
  });

  describe('subPostValidation 함수는....', () => {
    it('content의 값이 공백이면 false를 응답한다..', () => {
      subPostValidation({ title, content: '   ' }).should.be.false();
      subPostValidation({ title, content: '' }).should.be.false();
    });

    it('title 값이 없다면 false를 응답한다..', () => {
      subPostValidation({ content }).should.be.false();
    });

    it('category의 값이 없다면 false를 응답한다..', () => {
      subPostValidation({ title }).should.be.false();
    });

    it('title의 길이가 100이 넘으면 false를 응답한다.', () => {
      subPostValidation({ title: 'testval'.repeat(100), content }).should.be.false();
    });
  });

  describe('solvingValidation 함수는....', () => {
    it('title이 누락되면 false를 응답한다,', () => {
      solvingValidation({ content, url, category, problemNum: '99999' }).should.be.false();
    });

    it('category 누락되면 false를 응답한다,', () => {
      solvingValidation({ title, content, url, problemNum: '99999' }).should.be.false();
    });

    it('content 누락되면 false를 응답한다,', () => {
      solvingValidation({ title, url, category, problemNum: '99999' }).should.be.false();
    });

    it('url 누락되면 false를 응답한다,', () => {
      solvingValidation({ title, content, category, problemNum: '99999' }).should.be.false();
    });

    it('성공시 true를 응답한다 ', () => {
      solvingValidation({ title, content, category, url, problemNum: '99999' }).should.be.true();
    });
  });

  describe('postValidationV2 함수는....', () => {
    it('성공시 true를 반환한다..', () => {
      postValidationV2({ content, title, tags })[0].should.be.true;
    });

    it('title이 null이면 false를 반환한다..', () => {
      postValidationV2({ content, tags })[0].should.be.false();
    });

    it('title의 길이가 100이 넘으면 false를 반환한다..', () => {
      let title = 'da'.repeat(51);
      postValidationV2({ content, tags, title })[0].should.be.false();
    });

    it('TAG가 null이면 false를 반환한다..', () => {
      postValidationV2({ content, title })[0].should.be.false();
    });

    it('TAG가 빈값만 넘겨주면 false를 반환한다..', () => {
      let tags = ['', ''];
      postValidationV2({ content, title, tags })[0].should.be.false();
    });

    it('TAG가 빈값만 넘겨주면 false를 반환한다..', () => {
      let tags = [' ', '  '];
      postValidationV2({ title, tags, content })[0].should.be.false();
    });

    it('content가 null이면  false를 반환한다..', () => {
      postValidationV2({ title, tags })[0].should.be.false();
    });

    it('content가 null이면  false를 반환한다..', () => {
      let content = ' ';
      postValidationV2({ title, tags, content })[0].should.be.false();
    });
  });
});

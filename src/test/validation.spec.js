const should = require('should');
const middle = require('../lib/validation/validation');

describe('IsInteger.....', () => {
  it('실패시 false를 반환한다.....', () => {
    let result = paramIsINT({ 1: -1 });
    result.should.be.equal(false);
    result = paramIsINT({ 1: 0 });
    result.should.be.equal(false);
  });

  it('성공시 true를 반환한다...', () => {
    let result = paramIsINT({ 1: 1000, 2: 2000 });
    result.should.be.equal(true);
  });
});

function paramIsINT(input) {
  let param = Object.values(input);
  for (let element of param) {
    element = parseInt(element);
    if (!(element > 0)) {
      return false;
    }
  }
  return true;
}

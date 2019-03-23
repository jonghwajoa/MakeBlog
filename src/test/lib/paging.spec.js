const should = require('should');
const { paging } = require('../../lib/paging');

describe('paigng 함수는...', () => {
  it('option을 설정하지 않는 경우 default설정', () => {
    const result = paging(20);
    result.should.have.properties(['startPage', 'endPage', 'page', 'perPageNum', 'totalPage']);
  });

  it('페이지 갯수별 응답', () => {
    let result = paging(40, { perPageNum: 40, page: 1 });
    result.should.have.property('endPage', 1);
    result.should.have.property('totalPage', 1);

    result = paging(40, { perPageNum: 20, page: 1 });
    result.should.have.property('endPage', 2);
    result.should.have.property('totalPage', 2);

    result = paging(4000, { perPageNum: 20, page: 1 });
    result.should.have.property('endPage', 10);
    result.should.have.property('totalPage', 200);

    result = paging(4000, { perPageNum: 20, page: 11 });
    result.should.have.property('endPage', 20);
    result.should.have.property('totalPage', 200);

    result = paging(4000, { perPageNum: 50, page: 11 });
    result.should.have.property('endPage', 20);
    result.should.have.property('totalPage', 80);

    result = paging(4000, { perPageNum: 1, page: 11 });
    result.should.have.property('endPage', 20);
    result.should.have.property('totalPage', 4000);
  });
});

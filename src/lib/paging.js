/**
 * @param {number} totalCnt db에 저장된 게시글 총 갯수
 * @param {Object} reqeustPage
 * @param {number} reqeustPage.page
 * @param {number} reequstPage.perPageNum {page, perPageNum} 현재페이지, 한 페이지에 개시글 갯수
 * @returns {Object} paging result
 *
 */
function paging(totalCnt, { page = 1, perPageNum = 20 }) {
  // pagepostListNum: 한 화면에 보여줄 페이지 번호 갯수
  const pageListNum = 10;
  let totalPage = Math.floor(totalCnt / perPageNum);
  totalCnt % perPageNum ? totalPage++ : '';
  !totalPage ? totalPage++ : '';
  if (totalPage < page) page = totalPage;

  const startPage = Math.floor((page - 1) / pageListNum) * 10 + 1;
  let endPage = startPage + pageListNum - 1;
  endPage = endPage > totalPage ? totalPage : endPage;
  return { startPage, endPage, page, perPageNum, totalPage };
}

module.exports = { paging };

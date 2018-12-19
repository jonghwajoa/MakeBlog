const validation = require('./validation');

/*
  totalCnt : db에 저장된 게시글 총 갯수
  page : 현재 페이지
  pageNum : 한 페이지에 개시글 갯수
  pagepostListNum: 한 화면에 보여줄 페이지 갯수
//*/
function paging(totalCnt, { page = 1, perPageNum = 20 }) {
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

function postValidation({ title, tag, content, category }) {
  if (!content) return false;
  if (!validation.arrayElementIsString([title, tag, content, category])) {
    return false;
  }

  if (
    !(validation.isLength(title, 1, 100) && validation.isLength(tag, 1, 100))
  ) {
    return false;
  }

  if (!validation.checkTag(tag)) {
    return false;
  }

  return true;
}

function subPostValidation({ title, content }) {
  if (!validation.arrayElementIsString([title, content])) {
    return false;
  }

  if (!validation.isLength(title, 1, 100)) {
    return false;
  }
  return true;
}

module.exports = {
  paging,
  postValidation,
  subPostValidation,
};

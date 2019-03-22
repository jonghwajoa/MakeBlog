const db = require('../../db');
const paging = require('../../lib/paging');

const index = async (req, res, next) => {
  return res.render('team/admin/index');
};

const errorPage = async (req, res, next) => {
  let { page = 1, perPageNum = 20 } = req.query;
  perPageNum = Number(perPageNum);
  page = Number(page);

  let result;
  try {
    const totalCount = await db.ErrorLog.totalCount();
    pagingInfo = paging.paging(totalCount, { page, perPageNum });
    const offset = (pagingInfo.page - 1) * pagingInfo.perPageNum;
    result = await db.ErrorLog.findAllWithPaging(pagingInfo.perPageNum, offset);
  } catch (e) {
    next(e);
  }

  return res.render('team/admin/error', { data: result, pagingInfo });
};

module.exports = {
  index,
  errorPage,
};

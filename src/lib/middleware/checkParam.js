const yearValidation = year => {
  if (year.toString().length !== 4) {
    return false;
  }
  return true;
};

/**
 *   @since Version 1.1
 */
const paramIsINT = (req, res, next) => {
  let param = Object.values(req.params);
  if (param[0] === 'new') {
    return next();
  }

  for (let element of param) {
    element = parseInt(element);
    if (!(element > 0)) {
      const err = new Error('BadRequest');
      err.status = 400;
      return next(err);
    }
  }
  return next();
};

/**
 * @since Version 2.2
 */
const adminPageQueryCheck = (req, res, next) => {
  let queryObject = Object.values(req.query);
  for (let e of queryObject) {
    if (!Number.isInteger(Number(e))) {
      const err = new Error('BadRequest');
      err.status = 400;
      return next(err);
    }
  }
  next();
};

/**
 * @since Version 2.2
 */
const searchDailyQueryCheck = (req, res, next) => {
  let { year, month } = req.query;

  if (!year || !month) {
    const err = new Error('BadRequest');
    err.status = 400;
    return next(err);
  }

  const monthNumber = Number(month);
  const yearNumber = Number(year);
  if (!yearValidation(yearNumber)) {
    const err = new Error('BadRequest');
    err.status = 400;
    return next(err);
  }

  req.query.year = yearNumber;
  req.query.month = monthNumber;

  if (monthNumber < 1 || monthNumber > 12) {
    const err = new Error('BadRequest');
    err.status = 400;
    return next(err);
  }

  next();
};

/**
 * @since Version 2.2
 */
const searchMonthlQueryCheck = (req, res, next) => {
  let { year } = req.query;

  if (!year) {
    const err = new Error('BadRequest');
    err.status = 400;
    return next(err);
  }

  const yearNumber = Number(year);

  if (!yearValidation(yearNumber)) {
    const err = new Error('BadRequest');
    err.status = 400;
    return next(err);
  }

  req.query.year = yearNumber;
  next();
};

module.exports = {
  paramIsINT,
  adminPageQueryCheck,
  searchDailyQueryCheck,
  searchMonthlQueryCheck,
};

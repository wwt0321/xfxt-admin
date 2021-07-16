import litdate from '@xiongliding/litdate';

/**
 * 当天日期
 */
export const today = () => {
  return litdate().format('Y-m-d');
};

/**
 * 本月第一天 First Day of Month
 * @param {Date|String} 日期
 * @return String
 */
export const fdom = (date) => {
  return litdate(new Date(date)).format('Y-m-01');
};

/**
 * 本月最后一天 Last Day of Month
 * @param {Date|String} 日期
 * @return String
 */
export const ldom = (date) => {
  return litdate(new Date(date)).format('Y-m-t');
};

/**
 * 判断时间是否有效
 *
 * @param {String} y 年
 * @param {String} m 月
 * @param {String} d 日
 * @return Boolean
 */
export const validateYmd = (y, m, d) => {
  if (!m) {
    return true;
  }
  m = parseInt(m, 10);
  if (m < 1 || m > 12) {
    return false;
  }
  if (!d) {
    return true;
  }
  d = parseInt(d, 10);
  const maxday = litdate(new Date(`${y}-${m}-01`)).t;
  if (d < 1 || d > maxday) {
    return false;
  }
  return true;
};

/**
 * 根据用户已填部分确定日期范围
 *
 * @param {String} ymd 时间，支持 2021, 2021-07, 2021-07-13 等格式
 * @return {String[]}
 */
export const dateRangeYmd = (ymd) => {
  if (!ymd) {
    return [undefined, undefined];
  }
  const [y, m, d] = ymd.split('-');
  if (!m) {
    return [`${y}-01-01`, `${y}-12-31`];
  }
  const pm = m.padStart(2, '0');
  if (!d) {
    return [`${y}-${pm}-01`, ldom(`${y}-${pm}-01`)];
  }
  const pd = d.padStart(2, '0');
  const date = `${y}-${pm}-${pd}`;
  return [date, date];
};

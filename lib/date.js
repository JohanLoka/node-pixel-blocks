// Date formatter

const formatDate = (input) => {
  let dt = input;
  let month = dt.getMonth() + 1;
  month = month >= 10
    ? month
    : "0" + month;

  let day = dt.getDate();
  day = day >= 10
    ? day
    : "0" + day;
  const date = dt.getFullYear() + "-" + month + "-" + day;
  return date;
};

const sinceDate = days => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}

const today = formatDate(new Date());
const yesterday = formatDate(sinceDate(1));
const sinceDays = num => formatDate(sinceDate(num));

module.exports = {
  today,
  yesterday,
  sinceDays
}

const date = require('date-and-time');

const dateFormat = 'YYYY-MM-DD';
let current = new Date();
let start, end;

const getToday = function() {
  start = date.format(date.addDays(current, -1) , dateFormat);
  end = date.format(date.addDays(current, 1) , dateFormat);

  return {start, end};
}

const getYesterday = function() {
  start = date.format(date.addDays(current, -2) , dateFormat);
  end = date.format(current , dateFormat);

  return {start, end};
}

const getLastWeek = function() {
  start = date.format(date.addDays(current, -7) , dateFormat);
  end = date.format(date.addDays(current, 1) , dateFormat);

  return {start, end};
}

const getLastMonth = function() {
  start = date.format(date.addDays(date.addMonths(current, -1), -1) , dateFormat);
  end = date.format(date.addDays(current, 1) , dateFormat);

  return {start, end};
}

const getLastYear = function() {
  start = date.format(date.addDays(date.addYears(current, -1), -1) , dateFormat);
  end = date.format(date.addDays(current, 1) , dateFormat);

  return {start, end};
}

const getCustomDate = function(startingDate, endingDate) {
  start = date.format(date.addDays(date.parse(startingDate, dateFormat), -1), dateFormat);
  end = date.format(date.addDays(date.parse(endingDate, dateFormat), 1), dateFormat);

  return {start, end};
}

const getTrainingWeek = function() {
  start = date.format(date.addDays(current, -8) , dateFormat);
  end = date.format(date.addDays(current, 0) , dateFormat);

  return {start, end};
}

module.exports = {
  getToday,
  getYesterday,
  getLastWeek,
  getLastMonth,
  getLastYear,
  getCustomDate,
  getTrainingWeek
}
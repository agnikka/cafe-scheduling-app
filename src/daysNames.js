const getWeekDay = (dayNumber) => {
  const weekDays = {
    1: 'Monday',
    2: 'Tuesday',
    3: 'Wednesday',
    4: 'Thursday',
    5: 'Friday',
    6: 'Saturday',
    7: 'Sunday',
  };
  return weekDays[dayNumber];
};

module.exports.getWeekDay = getWeekDay;

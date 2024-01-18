const moment = require('moment');

module.exports = (startDate, endDate,days)=>{
    const result = [];
  const currentDate = moment(startDate);
  const endDateMoment = moment(endDate);

  while (currentDate.isBefore(endDateMoment) || currentDate.isSame(endDateMoment)) {
    if (currentDate.day() === days-1) {
      result.push(currentDate.format('YYYY-MM-DD HH:mm:ss'));
    }

    currentDate.add(1, 'days');
  }

  return result;
}
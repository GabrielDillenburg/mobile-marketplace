/* eslint-disable default-case */
import DaysOfTheWeek from '../constants/DaysOfTheWeek';
import formatDate from './formatDate';

/**
 * @file Functions related to date and time used to render timetable on class details screen.
 */

const sortDays = (a, b) => DaysOfTheWeek[a].index - DaysOfTheWeek[b].index;

const sortHours = (a, b) => a.time > b.time;

const insertTime = (group, item) => {
  if (group === undefined) {
    return {
      days: item.days.map((day) => DaysOfTheWeek[day].pt),
      hours: [{ id: item.id, time: item.time }],
    };
  }
  // eslint-disable-next-line no-param-reassign
  group.hours.push({ id: item.id, time: item.time });
  group.hours.sort(sortHours);
  return group;
};

const timeDiff = (time, diff) => {
  const [startHour, startMin] = time.substr(0, 5).split(':');
  const sumMin = Number(startMin) + Number(diff);
  const endMin = sumMin % 60;
  const endHour = (Math.floor(sumMin / 60) + Number(startHour)) % 24;

  return `${String(endHour).padStart(2, '0')}:${String(endMin).padStart(
    2,
    '0',
  )}`;
};

const formatTime = (time) =>
  time
    .substring(
      0,
      time.indexOf(':', 3) > 0 ? time.lastIndexOf(':') : time.length,
    )
    .padStart(5, '0');

const formatDayName = (dayName, formatType = null, formatCase = 'title') => {
  let day = dayName;

  switch (formatType) {
    case 'reduced':
      day = day.substring(
        0,
        day.indexOf('-') > 0 ? day.indexOf('-') : day.length,
      );
      break;
  }

  switch (formatCase) {
    case 'title':
      day = day.charAt(0).toUpperCase() + day.slice(1);
      break;
  }

  return day;
};

const formatDateTime = (datetime) => {
  const [date, time] = datetime.split(' ');
  return `${formatDate(date).substr(0, 5)}, ${formatTime(time)}`;
};

const daysString = (daysArray) => {
  const newArray = daysArray.map((day) =>
    formatDayName(day, 'reduced', 'title'),
  );

  return newArray.length > 1
    ? `${newArray.slice(0, -1).join(', ')} e ${newArray.slice(-1).toString()}`
    : newArray.toString();
};

const scheduleString = (classData) => {
  const { datetime, duration, weekday } = classData;
  return `${formatDayName(DaysOfTheWeek[weekday].pt)}, ${formatDateTime(
    datetime,
  )} - ${timeDiff(datetime.split(' ')[1], duration)}`;
};

export {
  sortDays,
  sortHours,
  insertTime,
  formatTime,
  daysString,
  scheduleString,
};

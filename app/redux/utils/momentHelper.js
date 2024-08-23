// import _ from 'lodash';
// import moment from 'moment';
import momentTimeZone from 'moment-timezone';

// const timeZone = momentTimeZone.tz.guess();
const timeZone = 'Europe/London';
momentTimeZone.tz.setDefault(timeZone);
// const timeZones = momentTimeZone.tz.names();
// console.log(timeZones);

/* replaced every where */
// moment\([A-Z|a-z|0-9|.|_]* \* 1000\)
// with
// getLocalMoment\([A-Z|a-z|0-9|.|_]*\)
export const getLocalMoment = (timestamp) => {
  /* old logic */
  // return moment(transaction.added * 1000);
  /* new logic */
  return momentTimeZone(timestamp * 1000).tz(timeZone);
};


export const getTimeStampFromDate = (date, format, end = false) => {
  if (end) {
    return momentTimeZone(date, format).add(1, 'day').tz(timeZone).unix();
  }
  return momentTimeZone(date, format).tz(timeZone).unix();
};

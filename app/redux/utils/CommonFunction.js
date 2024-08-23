import _ from 'lodash';
import { Client } from 'bugsnag-react-native';
import firebase from 'react-native-firebase';
import settings from '../../config/settings';

const errorMessageKey = ['message'];
const bugsnag = new Client(settings.bugsnagKey);

export const strIncludes = (str1, str2) => {
  if (_.isString(str1) && _.isString(str2)) {
    const lStr1 = str1.toLowerCase();
    const lStr2 = str2.toLowerCase();
    return lStr1.includes(lStr2);
  }
  return false;
};

export default function getArrayData(data) {
  let errs = [];
  if (_.isObject(data)) {
    /* eslint-disable array-callback-return */
    Object.keys(data).map((eK) => {
      if (errorMessageKey.indexOf(eK) > -1 && _.isString(data[eK])) {
        errs = [data[eK]];
      } else if (_.isArray(data[eK])) {
        errs = errs.concat(data[eK]);
      }
    });
  } else if (_.isString(data) || _.isNumber(data)) {
    errs = [data.toString()];
  } else {
    console.log('Not an Object');
  }
  return errs;
}

export function setLeaveBreadcrumb(payLoadObj) {
  console.log('payLoadObj =========================================================================================>');
  
  const actionType = _.isObject(payLoadObj) && _.isObject(payLoadObj.action) && _.isString(payLoadObj.action.type) ? payLoadObj.action.type : '';
  const screenName = _.isObject(payLoadObj) && _.isObject(payLoadObj.state) && _.isString(payLoadObj.state.routeName) ? payLoadObj.state.routeName : '';
  
  // console.log(actionType);
  // console.log();
  console.log('PayLoadObj ===> ', payLoadObj, ' Screen Name ===> ', screenName, 'Action Type ===> ', actionType);

  if (!_.isEmpty(screenName) && !_.isEmpty(actionType)) {
    firebase.analytics().setCurrentScreen(screenName);
  }

  bugsnag.leaveBreadcrumb(actionType, {
    type: _.isObject(payLoadObj) && payLoadObj.type ? payLoadObj.type : JSON.stringify(payLoadObj),
    actionType,
    screenName,
    location: 'commonFunction',
  });
}

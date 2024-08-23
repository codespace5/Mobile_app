/* eslint-disable prefer-template */
import _ from 'lodash';
import { Alert } from 'react-native';
import authActions from '../redux/reducers/auth/actions';
import getArrayData from '../redux/utils/CommonFunction';
import configureStore from '../redux/store/configureStore';

function CAlert(message, heading, onOk, onCancel) {
  const buttons = [
    {
      text: 'Ok',
      onPress: _.isFunction(onOk) ? onOk : () => {},
    },
  ];
  if (_.isFunction(onCancel)) {
    buttons.push({
      text: 'Cancel',
      onPress: onCancel,
    });
  }

  if (!heading) {
    const store = configureStore();
    const oops = store.dispatch(authActions.trans('error_msg_title'));
    Alert.alert(
      oops,
      message,
      buttons,
      { cancelable: false },
    );
  } else {
    Alert.alert(
      heading,
      message,
      buttons,
      { cancelable: false },
    );
  }
}

function EAlert(errors, heading, onOk, onCancel) {
  let message = 'Something Went Wrong';
  if (errors) {
    const arr = getArrayData(errors);
    if (_.isArray(arr) && arr.length > 0) {
      message = '';
      // eslint-disable-next-line array-callback-return
      arr.map((mm) => {
        message += mm + '\n\n';
      });
    }
  }
  CAlert(message, heading, onOk, onCancel);
}

function getReduxErrors(responseJson) {
  const ErrObj = {};
  if (_.isObject(responseJson.message)) {
    if (_.isObject(responseJson.message)) {
      Object.keys(responseJson.message).map((kk) => {
        ErrObj[kk] = _.isArray(responseJson.message[kk]) && responseJson.message[kk].length > 0 ? responseJson.message[kk].toString() : undefined;
      });
    }
  } else {
    console.log(responseJson.message);
    CAlert(responseJson.message);
  }
  return ErrObj;
}

export {
  CAlert,
  EAlert,
  getReduxErrors,
};

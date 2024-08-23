import { Platform } from 'react-native';
import firebase from 'react-native-firebase';
import { Client } from 'bugsnag-react-native';
import _ from 'lodash';
import settings from '../../../config/settings';
import types from './actions';

const bugsnag = new Client(settings.bugsnagKey);

const initialState = {
  token: '',
  notification: {},
  uuid: '',
  badge: 0,
  screen: 'Home',
  editData: {},
  videoDetails: [],
  userData: {},
  userId: {},
  userOtherData: {},
  connected: Platform.OS !== 'ios',
  country: {},
  language: {},
  forceLoad: false,
  signup_answer: {},
  adType: {},
  isHomePlayIndex: 0,
  isTop100PlayIndex: 0,
};

export default function reducer(state = initialState, actions) {
  console.log('In Auth Reducer ==> ', actions.type, actions);
  switch (actions.type) {
    case types.SET_TOKEN:
      console.log(`${types.SET_TOKEN} => `);
      console.log(`actions.token ${actions.token} => `);
      return {
        ...state,
        token: actions.token,
      };

    case types.SET_SCREEN:
      console.log(`${types.SET_SCREEN} => `);
      return {
        ...state,
        screen: actions.screen,
      };
    case types.SET_NOTIFICATION:
      console.log(`Set Notification ${types.SET_NOTIFICATION} => `);
      return {
        ...state,
        notification: actions.notification,
      };

    case types.SET_EDITDATA:
      console.log(`Set Editdata ${types.SET_EDITDATA} => `);
      return {
        ...state,
        editData: actions.editData,
      };

    case types.SET_UUID:
      console.log(`${types.SET_UUID} => `);
      console.log(actions.uuid);
      return {
        ...state,
        uuid: actions.uuid,
      };

    case types.SET_BADGE:
      console.log(`${types.SET_BADGE} => `);
      console.log(actions.badge);
      firebase
        .notifications()
        .setBadge(actions.badge === null ? 0 : actions.badge);
      return {
        ...state,
        badge: actions.badge,
      };
    case types.SET_VIDEOS_DATA:
      console.log(`${types.SET_VIDEOS_DATA} => `);
      return {
        ...state,
        videoDetails: actions.videoDetails,
      };

    case types.SET_USERDATA:
      console.log(`${types.SET_USERDATA} =>`);
      return {
        ...state,
        userData: actions.userData,
      };

    case types.SET_USER_ID:
      console.log(`${types.SET_USER_ID} =>`);
      return {
        ...state,
        userId: actions.userId,
      };

    case types.SET_USEROTHER_DATA:
      console.log(`${types.SET_USEROTHER_DATA} =>`);

      /* Set User details to Firebase and BugSnag */
      if (
        !_.isEmpty(actions.userOtherData)
        && !_.isEmpty(actions.userOtherData.user_id)
      ) {
        firebase.analytics().logEvent('user_login', {
          message: 'User Login',
          data: actions.userOtherData,
        });
        firebase.analytics().setUserId(actions.userOtherData.user_id);

        let uName = '';
        if (actions.userOtherData.firstname && actions.userOtherData.lastname) {
          uName = `${actions.userOtherData.firstname} ${actions.userOtherData.lastname}`;
          firebase
            .analytics()
            .setUserProperty('firstname', actions.userOtherData.firstname);
          firebase
            .analytics()
            .setUserProperty('lastname', actions.userOtherData.lastname);
        }

        // add user data in bugsnag..
        bugsnag.setUser(
          actions.userOtherData.user_id,
          uName,
          actions.userOtherData.email,
        );
        if (actions.userOtherData.email) {
          firebase
            .analytics()
            .setUserProperty('email', actions.userOtherData.email);
        }
      }

      return {
        ...state,
        userOtherData: actions.userOtherData,
      };

    case types.SET_NETWORK_STATUS:
      console.log(`${types.SET_NETWORK_STATUS} => `);
      return {
        ...state,
        connected: actions.connected,
      };

    case types.SET_SELECTED_COUNTRY:
      console.log(`${types.SET_SELECTED_COUNTRY} =>`);
      // eslint-disable-next-line no-case-declarations
      // if (_.isObject(actions.country) && actions.country.change === false) {
      //   return {
      //     ...state,
      //     country: initialState.country,
      //   };
      // }

      const obj = {
        ...state,
        country: actions.country,
      };

      // if (actions.country === true) {
      //   obj.tabPageIds = [0, 0, 0, 0, 0];
      // }

      if (_.isObject(actions.country) && _.isEmpty(actions.country)) {
        obj.tabPageIds = [0, 0, 0, 0, 0];
      }

      return obj;

    case types.SET_SELECTED_LANGUAGE:
      console.log(`${types.SET_SELECTED_LANGUAGE} =>`);
      return {
        ...state,
        language: actions.language,
      };

    case types.SET_FORCE_LOAD:
      console.log(`${types.SET_FORCE_LOAD} =>`);
      return {
        ...state,
        forceLoad: !state.forceLoad,
      };

    case types.Is_Signup_Que_Ans:
      console.log(`${types.Is_Signup_Que_Ans} =>`);
      return {
        ...state,
        signup_answer: actions.signup_answer,
      };

    case types.SET_ADTYPE:
      console.log(`${types.SET_ADTYPE} =>`);
      return {
        ...state,
        adType: actions.adType,
      };

    case types.SET_HOMEPLAY_INDEX:
      if (_.isEqual(state.isHomePlayIndex, actions.isHomePlayIndex)) return state;
      return {
        ...state,
        isHomePlayIndex: actions.isHomePlayIndex,
      };
    case types.SET_TOP100PLAY_INDEX:
      if (_.isEqual(state.isTop100PlayIndex, actions.isTop100PlayIndex)) return state;
      return {
        ...state,
        isTop100PlayIndex: actions.isTop100PlayIndex,
      };

    default:
      return state;
  }
}

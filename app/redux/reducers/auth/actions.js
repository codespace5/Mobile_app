import _ from 'lodash';
import homeActions from '../home/actions';
import I18n from '../../../config/i18n';

const actions = {
  SET_TOKEN: 'auth/SET_TOKEN',
  SET_NOTIFICATION: 'auth/SET_NOTIFICATION',
  SET_UUID: 'auth/SET_UUID',
  SET_BADGE: 'auth/SET_BADGE',
  SET_SCREEN: 'auth/SET_SCREEN',
  SET_EDITDATA: 'auth/SET_EDITDATA',
  SET_VIDEOS_DATA: 'auth/SET_VIDEOS_DATA',
  SET_USERDATA: 'auth/SET_USERDATA',
  SET_USER_ID: 'auth/SET_USER_ID',
  SET_USEROTHER_DATA: 'auth/SET_USEROTHER_DATA',
  SET_NETWORK_STATUS: 'auth/SET_NETWORK_STATUS',
  SET_SELECTED_COUNTRY: 'auth/SET_SELECTED_COUNTRY',
  SET_DEFAULT_LANGUAGE: 'auth/SET_DEFAULT_LANGUAGE',
  SET_SELECTED_LANGUAGE: 'auth/SET_SELECTED_LANGUAGE',
  SET_FORCE_LOAD: 'auth/SET_FORCE_LOAD',
  Is_Signup_Que_Ans: 'auth/Is_Signup_Que_Ans',
  SET_ADTYPE: 'auth/SET_ADTYPE',
  SET_HOMEPLAY_INDEX: 'auth/SET_HOMEPLAY_INDEX',
  SET_TOP100PLAY_INDEX: 'auth/SET_TOP100PLAY_INDEX',
  
  setToken: token => dispatch => dispatch({
    type: actions.SET_TOKEN,
    token,
  }),
  setVideoData: videoDetails => dispatch => dispatch({
    type: actions.SET_VIDEOS_DATA,
    videoDetails,
  }),
  setScreen: screen => dispatch => dispatch({
    type: actions.SET_SCREEN,
    screen,
  }),

  setUUid: uuid => dispatch => dispatch({
    type: actions.SET_UUID,
    uuid,
  }),

  onNewNotification: data => dispatch => dispatch({
    type: actions.SET_NOTIFICATION,
    notification: data,
  }),

  setBadge: badge => dispatch => dispatch({
    type: actions.SET_BADGE,
    badge,
  }),

  setEditdata: editData => dispatch => dispatch({
    type: actions.SET_EDITDATA,
    editData,
  }),

  setUserData: userData => dispatch => dispatch({
    type: actions.SET_USERDATA,
    userData,
  }),

  setUserId: userId => dispatch => dispatch({
    type: actions.SET_USER_ID,
    userId,
  }),

  setUserOtherData: userOtherData => dispatch => dispatch({
    type: actions.SET_USEROTHER_DATA,
    userOtherData,
  }),

  onConnectionChange: isConnected => (dispatch) => {
    console.log(`You are ${isConnected ? 'Online' : 'Offline'}`);
    return dispatch({
      type: actions.SET_NETWORK_STATUS,
      connected: isConnected,
    });
  },

  setCountry: country => (dispatch) => {
    dispatch({
      type: homeActions.RESET_TAB_IDS,
    });
    dispatch({
      type: actions.SET_SELECTED_COUNTRY,
      country,
    });
  },

  setLanguage: language => dispatch => dispatch({
    type: actions.SET_SELECTED_LANGUAGE,
    language,
  }),

  setTabID: tabPageIds => dispatch => dispatch({
    type: actions.SET_CURRENT_TAB_PAGE,
    tabPageIds,
  }),

  setForceLoad: () => dispatch => dispatch({
    type: actions.SET_FORCE_LOAD,
  }),

  signUp_Que_Ans: signup_answer => dispatch => dispatch({
    type: actions.Is_Signup_Que_Ans,
    signup_answer,
  }),

  setAdType: adType => dispatch => dispatch({
    type: actions.SET_ADTYPE,
    adType,
  }),

  setHomePlayIndex: isHomePlayIndex => dispatch => dispatch({
    type: actions.SET_HOMEPLAY_INDEX,
    isHomePlayIndex,
  }),

  setTop100PlayIndex: isTop100PlayIndex => dispatch => dispatch({
    type: actions.SET_TOP100PLAY_INDEX,
    isTop100PlayIndex,
  }),

  trans: (name, params = {}) => (dispatch, getState) => I18n.t(name, params),
};

export default actions;

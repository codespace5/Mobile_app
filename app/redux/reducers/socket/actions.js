import _ from 'lodash';
import io from 'socket.io-client';
import authActions from '../auth/actions';
import settings from '../../../config/settings';

let SOCKET = null;

const actions = {
  INIT_SOCKET: 'socket/INIT_SOCKET',
  EMIT_SOCKET: 'socket/EMIT_SOCKET',
  SET_SOCKET: 'socket/SET_SOCKET',
  SET_PREVIOUS_TRACKING: 'socket/SET_PREVIOUS_TRACKING',

  setSocket: socketObj => dispatch => dispatch({
    type: actions.SET_SOCKET,
    socketObj,
  }),

  onDisConnect: bool => (dispatch, getState) => {
    const { trackingStarted } = getState().auth;
    dispatch({
      type: actions.SET_PREVIOUS_TRACKING,
      previousTracking: trackingStarted,
    });
    // dispatch(authActions.stopTracking());
    if (bool) {
      dispatch({
        type: actions.SET_SOCKET,
        socketObj: null,
      });
    }
  },

  initialize: () => (dispatch, getState) => {
    console.log('initialize called');
    const { socketObj } = getState().socket;
    // const { screen } = getState().auth;
    if (socketObj === null) {
      SOCKET = io(settings.socketURL, {
        jsonp: false,
        transports: ['websocket'],
        path: '/ws',
      });
      SOCKET.on('connect_error', (error) => {
        // console.log('SOCKET connect_error');
        // console.log(error);
      });

      SOCKET.on('connect', () => {
        console.log('SOCKET connected');
        const { userData } = getState().auth;
        const { previousTracking } = getState().socket;
        dispatch(actions.setSocket(SOCKET));
        if (previousTracking) {
          dispatch(authActions.startTracking());
        }
        dispatch(actions.emit('appConnect', {
          // user_id: userData._id,
          /* eslint-disable no-underscore-dangle */
          user_id: _.isObject(userData) && _.isString(userData._id) ? userData._id : '',
          // userData: {},
          type: 'user',
        }));
      });

      // SOCKET.on('reconnect', () => {
      //   console.log('SOCKET reconnect');
      //   dispatch({
      //     type: actions.SET_SOCKET,
      //     socketObj: SOCKET,
      //   });
      // });

      SOCKET.on('driverMoved', (data) => {
        const { orderData, screen } = getState().auth;
        if (screen === 'Track') {
          console.log('driverMoved');
          console.log(data);
          if (_.isObject(data) && _.isObject(orderData)) {
            if (_.isArray(data.order_ids) && data.order_ids.indexOf(orderData._id) > -1) {
              // if (data.order.order_id === orderData._id
              // && data.order.order_user_id === userData._id) {
              console.log('driverMoved in screen');
              dispatch(authActions.setDriverTrack(data));
              // }
            }
          }
        }
      });

      SOCKET.on('disconnect', () => {
        console.log('SOCKET disconnect =>');
        dispatch(actions.onDisConnect(true));
      });
    }
  },

  emit: (event, data) => (dispatch, getState) => {
    const { socketObj } = getState().socket;
    if (socketObj !== null) {
      console.log(`${event} => emit`);
      console.log(data);
      socketObj.emit(event, data);
    }
  },

  disconnect: () => (dispatch, getState) => {
    const { socketObj } = getState().socket;
    if (socketObj !== null) {
      socketObj.disconnect();
      // socketObj = null;
      dispatch(actions.setSocket(null));
      // dispatch(authActions.stopTracking());
    }
  },
};

export default actions;

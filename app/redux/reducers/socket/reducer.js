import types from './actions';

const initialState = {
  socketObj: null,
  previousTracking: false,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case types.SET_SOCKET:
      console.log(`${types.SET_SOCKET} => `);
      return {
        ...state,
        socketObj: action.socketObj,
      };

    case types.SET_PREVIOUS_TRACKING:
      console.log(`${types.SET_PREVIOUS_TRACKING} => `);
      return {
        ...state,
        previousTracking: action.previousTracking,
      };

    default:
      return state;
  }
}

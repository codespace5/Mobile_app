import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';
import auth from './auth/reducer';
import home from './home/reducer';
import video from './video/reducer';
import socket from './socket/reducer';

const rootReducer = combineReducers({
  auth,
  home,
  video,
  form,
  socket,
});

export default rootReducer;

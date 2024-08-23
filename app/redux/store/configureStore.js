import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from '../reducers/rootReducer';
import apiMiddleware from '../middleware/api/middleware';

let middleware = [thunk, apiMiddleware];

middleware = [...middleware];
export default function configureStore(initialState) {
  return createStore(
    rootReducer,
    initialState,
    applyMiddleware(...middleware),
  );
}

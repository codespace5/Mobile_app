import actions from './actions';

export default ({ dispatch, getState }) => {
  return next => (action) => {
    switch (action.type) {
      case actions.LOGIN_INIT:
        console.log(`From Middleware => ${actions.LOGIN_INIT} => `);
        return next(action);
        // break;

      default:
        return next(action);
    }
  };
};

import Ember from 'ember';
import redux from 'redux';
import reducers from '../reducers/optional';
import enhancers from '../enhancers/index';
import middlewareConfig from '../middleware/index';

const { assert, isArray, get } = Ember;

// Handle "classic" middleware exports (i.e. an array), as well as the hash option
const extractMiddlewareConfig = (mc) => {
  assert(
    'Middleware must either be an array, or a hash containing a `middleware` property',
    isArray(mc) || mc.middleware
  );
  return isArray(mc) ? { middleware: mc } : mc;
}

const { createStore, applyMiddleware, combineReducers, compose } = redux;

const makeStoreInstance = ({middlewareConfig, reducers, enhancers}) => {
  // Destructure the middleware array and the setup thunk into two different variables
  const { middleware, setup = () => {} } = extractMiddlewareConfig(middlewareConfig);
  const createStoreWithMiddleware = compose(applyMiddleware(...middleware), enhancers)(createStore);
  const store = createStoreWithMiddleware(combineReducers(reducers));
  setup(store);
  return store;
};

export default Ember.Service.extend({
  middlewareConfig,
  reducers,
  enhancers,
  makeStoreInstance,
  init() {
    // gets the middlewareConfig from the instance of this service
    // if you'd like to customize your middlewares, you'd probably do it here
    const middlewareConfig = get(this, 'middlewareConfig');
    const reducers = get(this, 'reducers');
    const enhancers = get(this, 'enhancers');

    this.store = this.makeStoreInstance({ middlewareConfig, reducers, enhancers });
    this._super(...arguments);
  },
  getState() {
    return this.store.getState();
  },
  dispatch(action) {
    return this.store.dispatch(action);
  },
  subscribe(func) {
    return this.store.subscribe(func);
  }
});

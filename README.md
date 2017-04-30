# Ember Redux

[![Travis][build-badge]][build] [![Code Climate][climate-badge]][climate] [![Score][score-badge]][score] [![npm package][npm-badge]][npm]

## Description

[ember-cli][] addon that provides simple [redux][] bindings for [ember.js][]

## Installation

```
ember install ember-redux
```

## Documentation

http://www.ember-redux.com/

## Demo

Counting Example (simple)
https://ember-twiddle.com/2d98cd4418b7df5cbce6c5213351d31e

Yelp Clone (complex)
https://ember-twiddle.com/6969acc7dda6aef431344cca031dcfcf

## Examples

### Container Component

```js
import Ember from 'ember';
import hbs from 'htmlbars-inline-precompile';
import connect from 'ember-redux/components/connect';
import ajax from 'example/utilities/ajax';
import getUsersByAccountId from '../reducers';

var stateToComputed = (state, attrs) => {
  return {
    users: getUsersByAccountId(state, attrs.accountId)
  };
};

var dispatchToActions = (dispatch) => {
  return {
    remove: (id) => ajax(`/api/users/${id}`, 'DELETE').then(() => dispatch({type: 'REMOVE_USER', id: id}))
  };
};

var UserListComponent = Ember.Component.extend({
  layout: hbs`
    {{yield users (action "remove")}}
  `
});

export default connect(stateToComputed, dispatchToActions)(UserListComponent);
```

### Presentation Component

```js
import Ember from 'ember';
import hbs from 'htmlbars-inline-precompile';

var UserTableComponent = Ember.Component.extend({
  layout: hbs`
    {{#each users as |user|}}
      <div>{{user.name}}</div>
      <button onclick={{action remove user.id}}>remove</button>
    {{/each}}
  `
});

export default UserTableComponent;
```

### Composition

```js
{{#user-list accountId=accountId as |users remove|}}
  {{user-table users=users remove=remove}}
{{/user-list}}
```

## Customizing the Redux Service
The `ember-redux/services/redux` service automatically loads the following from your app:

* `app/reducers/index` - your reducers
* `app/enhancers/index` - your enhancers
* `app/middleware/index` - your middleware configs

For the purposes of customization, it's often enough to change whatever you need to in the above files. However, you can also directly extend the `ember-redux/services/redux` in the event you require finer control over the redux setup process:

```javascript
import ReduxService from 'ember-redux/services/redux';

export default ReduxService.extend({
  makeStoreInstance({middlewareConfig, reducers, enhancers}) {
    const store = whatever();
    return store;
  }
});
```

By default, `ReduxService` creates for an instance of the redux for you in the init function like so:

```javascript
const makeStoreInstance = ({middlewareConfig, reducers, enhancers}) => {
  const { middleware, setup = () => {} } = extractMiddlewareConfig(middlewareConfig);
  const createStoreWithMiddleware = compose(applyMiddleware(...middleware), enhancers)(createStore);
  const store = createStoreWithMiddleware(combineReducers(reducers));
  setup(store);
  return store;
};
```

## Why Doesn't This Work With My Version of Ember-CLI?!
You'll need your ember-cli to be version 2.10.x or higher. This is because anonymous AMD transforms (which we use to grab redux-thunk) was only introduced in 2.10.x. Happy upgrading!

## How do I enable time travel debugging?

1. Install the [redux dev tools extension].

2. Enjoy!

## Running Tests

    npm install
    bower install
    ember test

## License

Copyright © 2016 Toran Billups http://toranbillups.com

Licensed under the MIT License

[build-badge]: https://travis-ci.org/ember-redux/ember-redux.svg?branch=master
[build]: https://travis-ci.org/ember-redux/ember-redux

[npm-badge]: https://img.shields.io/npm/v/ember-redux.svg?style=flat-square
[npm]: https://www.npmjs.org/package/ember-redux

[climate-badge]: https://codeclimate.com/github/ember-redux/ember-redux/badges/gpa.svg
[climate]: https://codeclimate.com/github/ember-redux/ember-redux

[score-badge]: http://emberobserver.com/badges/ember-redux.svg
[score]: http://emberobserver.com/addons/ember-redux

[ember-cli]: http://www.ember-cli.com/
[ember.js]: http://emberjs.com/
[redux]: https://github.com/reactjs/redux

[redux dev tools extension]: https://github.com/zalmoxisus/redux-devtools-extension

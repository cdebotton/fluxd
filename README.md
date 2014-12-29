# Flux'd

A work in progress ES6 Flux framework.

## Examples
```js
// ./actions/UserActions.js

import flux from 'fluxd';

class UserActions {
  constructor() {
    this.generateActions('createUser', 'updateUser', 'destroyUser');
  }
}

export default flux.createActions(UserActions);
```

```js
// ./stores/UserStore.js

import {List} from 'immutable';
import UserActions from '../actions/UserActions';

const PAYLOAD = new Symbol('users payload');

class UserStore {
  constructor() {
    this.bindActions(UserActions);
    this[PAYLOAD] = List();
  }

  onCreateUser(user) {
    this[PAYLOAD] = this[PAYLOAD].concat([data]);
  }

  onUpdateUser(user) {
    var payload = this[PAYLOAD];
    var index = payload.findIndex(user => user.get('id') === user.id);
    this[PAYLOAD] = payload.setIn([index], user);
  }

  onDestroyUser(userId) {
    var payload = this[PAYLOAD];
    var index = payload.findIndex(user => user.id === userId);
    this[PAYLOAD] = payload.delete(index);
  }

  static getActive() {
    return this.getState().filter(user => user.active);
  }
}

export default flux.createStore(UserStore);
```

import EventEmitter from 'eventemitter3';
import {
  CHANGE_EVENT, STATE_CONTAINER, EVENT_EMITTER,
  STORE_BOOTSTRAP, STORE_SNAPSHOT, LISTENERS
} from './Symbols';

if (! Object.assign) {
  Object.assign = require('object-assign');
}

export default class Store {
  constructor(dispatcher, state) {
    this[STATE_CONTAINER] = state;
    this[EVENT_EMITTER] = new EventEmitter();

    if (state.onBootstrap) {
      this[STORE_BOOTSTRAP] = state.onBootstrap.bind(state);
    }

    if (state.onTakeSnapshot) {
      this[STORE_SNAPSHOT] = state.onTakeSnapshot.bind(state);
    }

    this.dispatchToken = dispatcher.register(payload => {
      if (state[LISTENERS][payload.action]) {
        var result = state[LISTENERS][payload.action](payload.data);
        result !== false && this.emitChange();
      }
    });
  }

  emitChange() {
    this[EVENT_EMITTER].emit(CHANGE_EVENT, this[STATE_CONTAINER]);
  }

  listen(cb) {
    this[EVENT_EMITTER].on(CHANGE_EVENT, cb);
  }

  unlisten(cb) {
    this[EVENT_EMITTER].removeListener(CHANGE_EVENT, cb);
  }

  getState() {
    return Object.assign({}, this[STATE_CONTAINER]);
  }
}

import EventEmitter from 'eventemitter3';
import {
  CHANGE_EVENT, STATE_CONTAINER, EVENT_EMITTER,
  STORE_BOOTSTRAP, STORE_SNAPSHOT, LISTENERS,
  ADAPTER_PENDING, ADAPTER_ERROR, ADAPTER_BAD_REQUEST,
  ADAPTER_TIMEOUT
} from './Symbols';

if (! Object.assign) {
  Object.assign = require('object-assign');
}

var {hasOwnProperty} = Object.prototype;

export default class BaseStore {
  constructor(dispatcher, state) {
    this[STATE_CONTAINER] = state;
    this[EVENT_EMITTER] = new EventEmitter();

    state.status = null;

    if (state.onBootstrap) {
      this[STORE_BOOTSTRAP] = state.onBootstrap.bind(state);
    }

    if (state.onTakeSnapshot) {
      this[STORE_SNAPSHOT] = state.onTakeSnapshot.bind(state);
    }
    this.dispatchToken = dispatcher.register(payload => {
      switch(payload.data) {
        case ADAPTER_PENDING:
        case ADAPTER_TIMEOUT:
        case ADAPTER_ERROR:
        case ADAPTER_BAD_REQUEST:
          state.status = {type: payload.data, message: payload.message};
          break;
        default:
          state.status = null;
          if (state[LISTENERS][payload.action]) {
            var result = state[LISTENERS][payload.action](payload.data);
            result !== false && this.emitChange();
          }
          break;
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

  isError() {
    return this.status &&
      hasOwnProperty(this.status, 'type') &&
      this.status.type == ADAPTER_ERROR;
  }

  isTimeout() {
    return this.status &&
      hasOwnProperty(this.status, 'type') &&
      this.status.type == ADAPTER_TIMEOUT;
  }

  isBadRequest() {
    return this.status &&
      hasOwnProperty(this.status, 'type') &&
      this.status.type == ADAPTER_BAD_REQUEST;
  }

  isPending() {
    return this.status &&
      hasOwnProperty(this.status, 'type') &&
      this.status.type == ADAPTER_PENDING;
  }
}

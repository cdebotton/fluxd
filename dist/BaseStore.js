"use strict";

var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

var EventEmitter = _interopRequire(require("eventemitter3"));

var CHANGE_EVENT = require("./Symbols").CHANGE_EVENT;
var STATE_CONTAINER = require("./Symbols").STATE_CONTAINER;
var EVENT_EMITTER = require("./Symbols").EVENT_EMITTER;
var STORE_BOOTSTRAP = require("./Symbols").STORE_BOOTSTRAP;
var STORE_SNAPSHOT = require("./Symbols").STORE_SNAPSHOT;
var LISTENERS = require("./Symbols").LISTENERS;
var ADAPTER_PENDING = require("./Symbols").ADAPTER_PENDING;
var ADAPTER_ERROR = require("./Symbols").ADAPTER_ERROR;
var ADAPTER_BAD_REQUEST = require("./Symbols").ADAPTER_BAD_REQUEST;
var ADAPTER_TIMEOUT = require("./Symbols").ADAPTER_TIMEOUT;


if (!Object.assign) {
  Object.assign = require("object-assign");
}

var hasOwnProperty = Object.prototype.hasOwnProperty;
var BaseStore = function BaseStore(dispatcher, state) {
  var _this = this;
  this[STATE_CONTAINER] = state;
  this[EVENT_EMITTER] = new EventEmitter();

  state.status = null;

  if (state.onBootstrap) {
    this[STORE_BOOTSTRAP] = state.onBootstrap.bind(state);
  }

  if (state.onTakeSnapshot) {
    this[STORE_SNAPSHOT] = state.onTakeSnapshot.bind(state);
  }
  this.dispatchToken = dispatcher.register(function (payload) {
    switch (payload.data) {
      case ADAPTER_PENDING:
      case ADAPTER_TIMEOUT:
      case ADAPTER_ERROR:
      case ADAPTER_BAD_REQUEST:
        state.status = { type: payload.data, message: payload.message };
        break;
      default:
        state.status = null;
        if (state[LISTENERS][payload.action]) {
          var result = state[LISTENERS][payload.action](payload.data);
          result !== false && _this.emitChange();
        }
        break;
    }
  });
};

BaseStore.prototype.emitChange = function () {
  this[EVENT_EMITTER].emit(CHANGE_EVENT, this[STATE_CONTAINER]);
};

BaseStore.prototype.listen = function (cb) {
  this[EVENT_EMITTER].on(CHANGE_EVENT, cb);
};

BaseStore.prototype.unlisten = function (cb) {
  this[EVENT_EMITTER].removeListener(CHANGE_EVENT, cb);
};

BaseStore.prototype.getState = function () {
  return Object.assign({}, this[STATE_CONTAINER]);
};

BaseStore.prototype.isError = function () {
  return this.status && hasOwnProperty(this.status, "type") && this.status.type == ADAPTER_ERROR;
};

BaseStore.prototype.isTimeout = function () {
  return this.status && hasOwnProperty(this.status, "type") && this.status.type == ADAPTER_TIMEOUT;
};

BaseStore.prototype.isBadRequest = function () {
  return this.status && hasOwnProperty(this.status, "type") && this.status.type == ADAPTER_BAD_REQUEST;
};

BaseStore.prototype.isPending = function () {
  return this.status && hasOwnProperty(this.status, "type") && this.status.type == ADAPTER_PENDING;
};

module.exports = BaseStore;
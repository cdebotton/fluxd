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


if (!Object.assign) {
  Object.assign = require("object-assign");
}

var BaseStore = function BaseStore(dispatcher, state) {
  var _this = this;
  this[STATE_CONTAINER] = state;
  this[EVENT_EMITTER] = new EventEmitter();

  if (state.onBootstrap) {
    this[STORE_BOOTSTRAP] = state.onBootstrap.bind(state);
  }

  if (state.onTakeSnapshot) {
    this[STORE_SNAPSHOT] = state.onTakeSnapshot.bind(state);
  }

  this.dispatchToken = dispatcher.register(function (payload) {
    if (state[LISTENERS][payload.action]) {
      var result = state[LISTENERS][payload.action](payload.data);
      result !== false && _this.emitChange();
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

module.exports = BaseStore;
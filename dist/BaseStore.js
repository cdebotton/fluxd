"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var EventEmitter = _interopRequire(require("eventemitter3"));

var _Symbols = require("./Symbols");

var CHANGE_EVENT = _Symbols.CHANGE_EVENT;
var STATE_CONTAINER = _Symbols.STATE_CONTAINER;
var EVENT_EMITTER = _Symbols.EVENT_EMITTER;
var STORE_BOOTSTRAP = _Symbols.STORE_BOOTSTRAP;
var STORE_SNAPSHOT = _Symbols.STORE_SNAPSHOT;
var LISTENERS = _Symbols.LISTENERS;
var ADAPTER_PENDING = _Symbols.ADAPTER_PENDING;
var ADAPTER_ERROR = _Symbols.ADAPTER_ERROR;
var ADAPTER_BAD_REQUEST = _Symbols.ADAPTER_BAD_REQUEST;
var ADAPTER_TIMEOUT = _Symbols.ADAPTER_TIMEOUT;


if (!Object.assign) {
  Object.assign = require("object-assign");
}

var hasOwnProperty = Object.prototype.hasOwnProperty;
var BaseStore = (function () {
  function BaseStore(dispatcher, state) {
    var _this = this;
    _classCallCheck(this, BaseStore);

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
  }

  _prototypeProperties(BaseStore, null, {
    emitChange: {
      value: function emitChange() {
        this[EVENT_EMITTER].emit(CHANGE_EVENT, this[STATE_CONTAINER]);
      },
      writable: true,
      configurable: true
    },
    listen: {
      value: function listen(cb) {
        this[EVENT_EMITTER].on(CHANGE_EVENT, cb);
      },
      writable: true,
      configurable: true
    },
    unlisten: {
      value: function unlisten(cb) {
        this[EVENT_EMITTER].removeListener(CHANGE_EVENT, cb);
      },
      writable: true,
      configurable: true
    },
    getState: {
      value: function getState() {
        return Object.assign({}, this[STATE_CONTAINER]);
      },
      writable: true,
      configurable: true
    },
    isError: {
      value: function isError() {
        var status = this[STATE_CONTAINER].status;
        return status && hasOwnProperty.call(status, "type") && status.type === ADAPTER_ERROR;
      },
      writable: true,
      configurable: true
    },
    isTimeout: {
      value: function isTimeout() {
        var status = this[STATE_CONTAINER].status;
        return status && hasOwnProperty.call(status, "type") && status.type === ADAPTER_TIMEOUT;
      },
      writable: true,
      configurable: true
    },
    isBadRequest: {
      value: function isBadRequest() {
        var status = this[STATE_CONTAINER].status;
        return status && hasOwnProperty.call(status, "type") && status.type === ADAPTER_BAD_REQUEST;
      },
      writable: true,
      configurable: true
    },
    isPending: {
      value: function isPending() {
        var status = this[STATE_CONTAINER].status;
        return status && hasOwnProperty.call(status, "type") && status.type === ADAPTER_PENDING;
      },
      writable: true,
      configurable: true
    }
  });

  return BaseStore;
})();

module.exports = BaseStore;
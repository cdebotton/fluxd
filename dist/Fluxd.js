"use strict";

var _slice = Array.prototype.slice;
var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

var ActionCreator = _interopRequire(require("./ActionCreator"));

var BaseStore = _interopRequire(require("./BaseStore"));

var formatAsConstant = _interopRequire(require("./utils/formatAsConstant"));

var StorePrototype = _interopRequire(require("./utils/StorePrototype"));

var Symbol = _interopRequire(require("./polyfills/es6-symbol"));

var Dispatcher = require("flux").Dispatcher;
var STORES_STORE = require("./Symbols").STORES_STORE;
var BOOTSTRAP_FLAG = require("./Symbols").BOOTSTRAP_FLAG;
var ACTION_HANDLER = require("./Symbols").ACTION_HANDLER;
var ACTION_KEY = require("./Symbols").ACTION_KEY;
var STATE_CONTAINER = require("./Symbols").STATE_CONTAINER;
var STORE_BOOTSTRAP = require("./Symbols").STORE_BOOTSTRAP;
var STORE_SNAPSHOT = require("./Symbols").STORE_SNAPSHOT;
var LISTENERS = require("./Symbols").LISTENERS;
var builtIns = require("./utils/internalMethods").builtIns;
var builtInProto = require("./utils/internalMethods").builtInProto;
var getInternalMethods = require("./utils/internalMethods").getInternalMethods;


if (!Object.assign) {
  Object.assign = require("object-assign");
}

var Fluxd = function Fluxd() {
  this.dispatcher = new Dispatcher();
  this[STORES_STORE] = {};
  this[BOOTSTRAP_FLAG] = false;
};

Fluxd.prototype.createStore = function (StoreModel, iden) {
  var _this = this;
  var key = iden || StoreModel.displayName || StoreModel.name;
  function Store() {
    StoreModel.call(this);
  }
  Store.prototype = StoreModel.prototype;
  Store.prototype[LISTENERS] = {};
  Object.assign(Store.prototype, StorePrototype, {
    _storeName: key,
    dispatcher: this.dispatcher,
    getInstance: function () {
      return _this[STORES_STORE][key];
    }
  });

  var store = new Store();

  if (this[STORES_STORE][key]) {
    throw new ReferenceError("A store named " + key + " already exists, double check your store names " + "or pass in your own custom identifier for eachs tore");
  }

  return this[STORES_STORE][key] = Object.assign(new BaseStore(this.dispatcher, store), getInternalMethods(StoreModel, builtIns));
};

Fluxd.prototype.createActions = function (ActionsClass) {
  var _this2 = this;
  var key = ActionsClass.displayName || ActionsClass.name;
  var actions = Object.assign({}, getInternalMethods(ActionsClass.prototype, builtInProto));

  ActionsClass.call({
    generateActions: function () {
      var actionNames = _slice.call(arguments);

      actionNames.forEach(function (actionName) {
        actions[actionName] = function (x) {
          var a = _slice.call(arguments, 1);

          this.dispatch(a.length ? [x].concat(a) : x);
        };
      });
    }
  });

  return Object.keys(actions).reduce(function (obj, action) {
    var constant = formatAsConstant(action);
    var actionName = Symbol("action " + key + ".prototype." + action);

    var newAction = new ActionCreator(_this2.dispatcher, actionName, actions[action], obj);

    obj[action] = newAction[ACTION_HANDLER];
    obj[action].defer = function (x) {
      return setTimeout(function () {
        return newAction[ACTION_HANDLER](x);
      });
    };
    obj[action][ACTION_KEY] = actionName;
    obj[constant] = actionName;

    return obj;
  }, {});
};

Fluxd.prototype.takeSnapshot = function () {
  var _this3 = this;
  var state = JSON.stringify(Object.keys(this[STORES_STORE]).reduce(function (obj, key) {
    if (_this3[STORES_STORE][key][STORE_SNAPSHOT]) {
      _this3[STORES_STORE][key][STORE_SNAPSHOT]();
    }
    obj[key] = _this3[STORES_STORE][key].getState();
    return obj;
  }, {}));

  this._lastSnapshot = state;
  return state;
};

Fluxd.prototype.rollback = function () {
  this[BOOTSTRAP_FLAG] = false;
  this.bootstrap(this._lastSnapshot);
};

Fluxd.prototype.bootstrap = function (data) {
  var _this4 = this;
  if (this[BOOTSTRAP_FLAG]) {
    throw new ReferenceError("Stores have already been bootstrapped");
  }

  var obj = JSON.parse(data);
  Object.keys(obj).forEach(function (key) {
    Object.assign(_this4[STORES_STORE][key][STATE_CONTAINER], obj[key]);
    if (_this4[STORES_STORE][key][STORE_BOOTSTRAP]) {
      _this4[STORES_STORE][key][STORE_BOOTSTRAP]();
    }
  });

  this[BOOTSTRAP_FLAG] = true;
};

module.exports = Fluxd;

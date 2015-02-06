"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var ActionCreator = _interopRequire(require("./ActionCreator"));

var BaseAdapter = _interopRequire(require("./BaseAdapter"));

var BaseStore = _interopRequire(require("./BaseStore"));

var formatAsResource = _interopRequire(require("./utils/formatAsResource"));

var formatAsConstant = _interopRequire(require("./utils/formatAsConstant"));

var StorePrototype = _interopRequire(require("./utils/StorePrototype"));

var Symbol = _interopRequire(require("./polyfills/es6-symbol"));

var Dispatcher = require("flux").Dispatcher;
var _Symbols = require("./Symbols");

var STORES_STORE = _Symbols.STORES_STORE;
var BOOTSTRAP_FLAG = _Symbols.BOOTSTRAP_FLAG;
var ACTION_HANDLER = _Symbols.ACTION_HANDLER;
var ACTION_KEY = _Symbols.ACTION_KEY;
var STATE_CONTAINER = _Symbols.STATE_CONTAINER;
var STORE_BOOTSTRAP = _Symbols.STORE_BOOTSTRAP;
var STORE_SNAPSHOT = _Symbols.STORE_SNAPSHOT;
var LISTENERS = _Symbols.LISTENERS;
var ADAPTERS_STORE = _Symbols.ADAPTERS_STORE;
var ADAPTER_ROOT = _Symbols.ADAPTER_ROOT;
var ADAPTER_RESOURCE = _Symbols.ADAPTER_RESOURCE;
var ACTION_BINDING = _Symbols.ACTION_BINDING;
var _utilsInternalMethods = require("./utils/internalMethods");

var builtIns = _utilsInternalMethods.builtIns;
var builtInProto = _utilsInternalMethods.builtInProto;
var getInternalMethods = _utilsInternalMethods.getInternalMethods;


if (!Object.assign) {
  Object.assign = require("object-assign");
}

var Fluxd = (function () {
  function Fluxd() {
    _classCallCheck(this, Fluxd);

    this.dispatcher = new Dispatcher();
    this[STORES_STORE] = {};
    this[ADAPTERS_STORE] = {};
    this[BOOTSTRAP_FLAG] = false;
  }

  _prototypeProperties(Fluxd, null, {
    createStore: {
      value: function createStore(StoreModel, iden) {
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
          throw new ReferenceError("A store named " + key + " already exists, double check your store names " + "or pass in your own custom identifier for each store");
        }

        return this[STORES_STORE][key] = Object.assign(new BaseStore(this.dispatcher, store), getInternalMethods(StoreModel, builtIns));
      },
      writable: true,
      configurable: true
    },
    createActions: {
      value: function createActions(ActionsClass) {
        var _this = this;
        var key = ActionsClass.displayName || ActionsClass.name;
        var actions = Object.assign({}, getInternalMethods(ActionsClass.prototype, builtInProto));

        ActionsClass.prototype.generateActions = function () {
          for (var _len = arguments.length, actionNames = Array(_len), _key = 0; _key < _len; _key++) {
            actionNames[_key] = arguments[_key];
          }

          actionNames.forEach(function (actionName) {
            actions[actionName] = function (x) {
              for (var _len2 = arguments.length, a = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                a[_key2 - 1] = arguments[_key2];
              }

              this.dispatch(a.length ? [x].concat(a) : x);
            };
          });
        };

        new ActionsClass();

        return Object.keys(actions).reduce(function (obj, action) {
          var constant = formatAsConstant(action);
          var actionName = Symbol("action " + key + ".prototype." + action);

          var newAction = new ActionCreator(_this.dispatcher, actionName, actions[action], obj);

          obj[action] = newAction[ACTION_HANDLER];
          obj[action].defer = function (x) {
            return setTimeout(function () {
              return newAction[ACTION_HANDLER](x);
            });
          };
          obj[action][ACTION_KEY] = actionName;
          obj[action][ACTION_BINDING] = action;
          obj[constant] = actionName;

          return obj;
        }, {});
      },
      writable: true,
      configurable: true
    },
    createAdapter: {
      value: function createAdapter(AdapterClass) {
        var _this = this;
        var key = AdapterClass.displayName || AdapterClass.name;
        var resource = formatAsResource(key);
        var config = {};

        AdapterClass.call({
          configure: function configure(params) {
            Object.assign(config, params);
          }
        });

        function Adapter() {
          AdapterClass.call(this);
        }
        Adapter.prototype = AdapterClass.prototype;

        var adapter = Object.assign(new BaseAdapter(config.root, resource), getInternalMethods(AdapterClass, builtIns));

        var actions = Object.assign(getInternalMethods(BaseAdapter.prototype, builtInProto), getInternalMethods(AdapterClass.prototype, builtInProto));

        return Object.keys(actions).reduce(function (obj, action) {
          var resourceSuffix = resource.replace(/./, function (x) {
            return x.toUpperCase();
          });
          var actionStr = "" + action + "" + resourceSuffix;
          var constant = formatAsConstant(actionStr);
          var actionName = Symbol("action " + key + ".prototype." + action);

          var newAction = new ActionCreator(_this.dispatcher, actionName, adapter[action], obj, config.root, resource);

          obj[action] = newAction[ACTION_HANDLER];
          obj[action].defer = function (x) {
            return setTimeout(function () {
              return newAction[ACTION_HANDLER](x);
            });
          };
          obj[action][ACTION_KEY] = actionName;
          obj[action][ACTION_BINDING] = actionStr;
          obj[constant] = actionName;

          return obj;
        }, {});
      },
      writable: true,
      configurable: true
    },
    takeSnapshot: {
      value: function takeSnapshot() {
        var _this = this;
        var state = JSON.stringify(Object.keys(this[STORES_STORE]).reduce(function (obj, key) {
          if (_this[STORES_STORE][key][STORE_SNAPSHOT]) {
            _this[STORES_STORE][key][STORE_SNAPSHOT]();
          }
          obj[key] = _this[STORES_STORE][key].getState();
          return obj;
        }, {}));

        this._lastSnapshot = state;
        return state;
      },
      writable: true,
      configurable: true
    },
    rollback: {
      value: function rollback() {
        this[BOOTSTRAP_FLAG] = false;
        this.bootstrap(this._lastSnapshot);
      },
      writable: true,
      configurable: true
    },
    bootstrap: {
      value: function bootstrap(data) {
        var _this = this;
        if (this[BOOTSTRAP_FLAG]) {
          throw new ReferenceError("Stores have already been bootstrapped");
        }

        var obj = JSON.parse(data);
        Object.keys(obj).forEach(function (key) {
          Object.assign(_this[STORES_STORE][key][STATE_CONTAINER], obj[key]);
          if (_this[STORES_STORE][key][STORE_BOOTSTRAP]) {
            _this[STORES_STORE][key][STORE_BOOTSTRAP]();
          }
        });

        this[BOOTSTRAP_FLAG] = true;
      },
      writable: true,
      configurable: true
    }
  });

  return Fluxd;
})();

module.exports = Fluxd;
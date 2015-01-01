import ActionCreator from './ActionCreator';
import BaseAdapter from './BaseAdapter';
import BaseStore from './BaseStore';
import formatAsResource from './utils/formatAsResource';
import formatAsConstant from './utils/formatAsConstant';
import AdapterPrototype from './utils/AdapterPrototype';
import StorePrototype from './utils/StorePrototype';
import Symbol from './polyfills/es6-symbol';
import {Dispatcher} from 'flux';

import {
  STORES_STORE, BOOTSTRAP_FLAG, ACTION_HANDLER, ACTION_KEY,
  STATE_CONTAINER, STORE_BOOTSTRAP, STORE_SNAPSHOT, LISTENERS,
  ADAPTERS_STORE, ADAPTER_ROOT, ADAPTER_RESOURCE, ACTION_BINDING
} from './Symbols';

import {
  builtIns, builtInProto, getInternalMethods
} from './utils/internalMethods';

if (! Object.assign) {
  Object.assign = require('object-assign');
}

export default class Fluxd {
  constructor() {
    this.dispatcher = new Dispatcher();
    this[STORES_STORE] = {};
    this[ADAPTERS_STORE] = {};
    this[BOOTSTRAP_FLAG] = false;
  }

  createStore(StoreModel, iden) {
    var key = iden || StoreModel.displayName || StoreModel.name;
    function Store() { StoreModel.call(this); }
    Store.prototype = StoreModel.prototype;
    Store.prototype[LISTENERS] = {};
    Object.assign(Store.prototype, StorePrototype, {
      _storeName: key,
      dispatcher: this.dispatcher,
      getInstance: () => this[STORES_STORE][key]
    });

    var store = new Store();

    if (this[STORES_STORE][key]) {
      throw new ReferenceError(
        `A store named ${key} already exists, double check your store names ` +
        `or pass in your own custom identifier for each store`
      );
    }

    return this[STORES_STORE][key] = Object.assign(
      new BaseStore(this.dispatcher, store),
      getInternalMethods(StoreModel, builtIns)
    );
  }

  createActions(ActionsClass) {
    var key = ActionsClass.displayName || ActionsClass.name;
    var actions = Object.assign(
      {},
      getInternalMethods(ActionsClass.prototype, builtInProto)
    );

    ActionsClass.call({
      generateActions(...actionNames) {
        actionNames.forEach(actionName => {
          actions[actionName] = function(x, ...a) {
            this.dispatch(a.length ? [x].concat(a) : x);
          }
        });
      }
    });

    return Object.keys(actions).reduce((obj, action) => {
      var constant = formatAsConstant(action);
      var actionName = Symbol(`action ${key}.prototype.${action}`);

      var newAction = new ActionCreator(
        this.dispatcher,
        actionName,
        actions[action],
        obj
      );

      obj[action] = newAction[ACTION_HANDLER];
      obj[action].defer = (x) => setTimeout(() => newAction[ACTION_HANDLER](x));
      obj[action][ACTION_KEY] = actionName;
      obj[action][ACTION_BINDING] = action;
      obj[constant] = actionName;

      return obj;
    }, {});
  }

  createAdapter(AdapterClass) {
    var key = AdapterClass.displayName || AdapterClass.name;
    var resource = formatAsResource(key);
    var config = {};

    AdapterClass.call({
      configure(params) {
        Object.assign(config, params);
      }
    });

    function Adapter() { AdapterClass.call(this); }
    Adapter.prototype = AdapterClass.prototype;

    var adapter = Object.assign(
      new BaseAdapter(config.root, resource),
      getInternalMethods(AdapterClass, builtIns)
    );

    var actions = Object.assign(
      getInternalMethods(BaseAdapter.prototype, builtInProto),
      getInternalMethods(AdapterClass.prototype, builtInProto)
    );

    return Object.keys(actions).reduce((obj, action) => {
      var resourceSuffix = resource.replace(/./, (x) => x.toUpperCase());
      var actionStr = `${action}${resourceSuffix}`;
      var constant = formatAsConstant(actionStr);
      var actionName = Symbol(`action ${key}.prototype.${action}`);

      var newAction = new ActionCreator(
        this.dispatcher,
        actionName,
        adapter[action],
        obj,
        config.root,
        resource
      );

      obj[ADAPTER_ROOT] = config.root;
      obj[ADAPTER_RESOURCE] = resource;
      obj[action] = newAction[ACTION_HANDLER];
      obj[action].defer = (x) => setTimeout(() => newAction[ACTION_HANDLER](x));
      obj[action][ACTION_KEY] = actionName;
      obj[action][ACTION_BINDING] = actionStr;
      obj[constant] = actionName;
      return obj;
    }, {});
  }

  takeSnapshot() {
    var state = JSON.stringify(
      Object.keys(this[STORES_STORE]).reduce((obj, key) => {
        if (this[STORES_STORE][key][STORE_SNAPSHOT]) {
          this[STORES_STORE][key][STORE_SNAPSHOT]();
        }
        obj[key] = this[STORES_STORE][key].getState();
        return obj;
      }, {})
    );

    this._lastSnapshot = state;
    return state;
  }

  rollback() {
    this[BOOTSTRAP_FLAG] = false;
    this.bootstrap(this._lastSnapshot);
  }

  bootstrap(data) {
    if (this[BOOTSTRAP_FLAG]) {
      throw new ReferenceError('Stores have already been bootstrapped');
    }

    var obj = JSON.parse(data);
    Object.keys(obj).forEach(key => {
      Object.assign(this[STORES_STORE][key][STATE_CONTAINER], obj[key]);
      if (this[STORES_STORE][key][STORE_BOOTSTRAP]) {
        this[STORES_STORE][key][STORE_BOOTSTRAP]();
      }
    });

    this[BOOTSTRAP_FLAG] = true;
  }
}

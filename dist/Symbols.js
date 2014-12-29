"use strict";

var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

var Symbol = _interopRequire(require("./polyfills/es6-symbol"));

var VariableSymbol = function (desc) {
  return Symbol("" + now + "" + desc);
};

var ACTION_DISPATCHER = exports.ACTION_DISPATCHER = Symbol("action dispatcher storage");
var ACTION_HANDLER = exports.ACTION_HANDLER = Symbol("action creator handler");
var ACTION_UID = exports.ACTION_UID = Symbol("the actions uid name");
var ACTION_KEY = exports.ACTION_KEY = Symbol("holds the actions uid symbol for listening");
var CHANGE_EVENT = exports.CHANGE_EVENT = Symbol("store change event");
var EVENT_EMITTER = exports.EVENT_EMITTER = Symbol("event emitter instance");
var STORE_BOOTSTRAP = exports.STORE_BOOTSTRAP = Symbol("event handler onBootstrap");
var STORE_SNAPSHOT = exports.STORE_SNAPSHOT = Symbol("event handler onTakeSnapshot");
var LISTENERS = exports.LISTENERS = Symbol("stores action listeners storage");
var STORES_STORE = exports.STORES_STORE = Symbol("stores storage");
var MIXIN_REGISTRY = exports.MIXIN_REGISTRY = Symbol("_fluxd store listener registry_");
var STATE_CONTAINER = exports.STATE_CONTAINER = VariableSymbol("fluxd state container");
var BOOTSTRAP_FLAG = exports.BOOTSTRAP_FLAG = VariableSymbol("have you bootstrapped yet?");
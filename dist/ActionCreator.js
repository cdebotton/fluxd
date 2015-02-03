"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _Symbols = require("./Symbols");

var ACTION_DISPATCHER = _Symbols.ACTION_DISPATCHER;
var ACTION_HANDLER = _Symbols.ACTION_HANDLER;
var ACTION_UID = _Symbols.ACTION_UID;
var ADAPTER_ROOT = _Symbols.ADAPTER_ROOT;
var ADAPTER_RESOURCE = _Symbols.ADAPTER_RESOURCE;
var ActionCreator = (function () {
  function ActionCreator(dispatcher, name, action, actions, root, resource) {
    _classCallCheck(this, ActionCreator);

    this[ACTION_DISPATCHER] = dispatcher;
    this[ACTION_UID] = name;
    this[ACTION_HANDLER] = action.bind(this);

    if (root) {
      this[ADAPTER_ROOT] = root;
    }

    if (resource) {
      this[ADAPTER_RESOURCE] = resource;
    }

    this.actions = actions;
  }

  _prototypeProperties(ActionCreator, null, {
    dispatch: {
      value: function dispatch(data) {
        this[ACTION_DISPATCHER].dispatch({
          action: this[ACTION_UID],
          data: data
        });
      },
      writable: true,
      configurable: true
    }
  });

  return ActionCreator;
})();

module.exports = ActionCreator;
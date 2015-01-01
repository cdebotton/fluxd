"use strict";

var ACTION_KEY = require("../Symbols").ACTION_KEY;
var LISTENERS = require("../Symbols").LISTENERS;
var ACTION_BINDING = require("../Symbols").ACTION_BINDING;


var StorePrototype = {
  bindAction: function (symbol, handler) {
    if (!symbol) {
      throw new ReferenceError("Invalid action reference");
    }
    if (typeof handler !== "function") {
      throw new TypeError("bindAction expects a function");
    }

    if (handler.length > 1) {
      throw new TypeError("Action handler in store " + this._storeName + " for " + ("" + (symbol[ACTION_KEY] || symbol) + " was defined with more than ") + "one paremeter. Only a single paramter is passed through the " + "dispatcher, did you mean to pass in an Object instead?");
    }

    if (symbol[ACTION_KEY]) {
      this[LISTENERS][symbol[ACTION_KEY]] = handler.bind(this);
    } else {
      this[LISTENERS][symbol] = handler.bind(this);
    }
  },

  bindActions: function (actions) {
    var _this = this;
    Object.keys(actions).forEach(function (action) {
      var symbol = actions[action];
      var binding = actions[action][ACTION_BINDING] || action;
      var assumedEventHandler = binding.replace(/./, function (x) {
        return "on" + x[0].toUpperCase();
      });
      var handler = null;

      if (_this[binding] && _this[assumedEventHandler]) {
        throw new ReferenceError("You have multiple action handlers bound to an action: " + ("" + action + " and " + assumedEventHandler));
      } else if (_this[binding]) {
        handler = _this[binding];
      } else if (_this[assumedEventHandler]) {
        handler = _this[assumedEventHandler];
      }

      if (handler) {
        _this.bindAction(symbol, handler);
      }
    });
  },

  waitFor: function (tokens) {
    if (!tokens) {
      throw new ReferenceError("Dispatch tokens not provided");
    }

    tokens = Array.isArray(tokens) ? tokens : [tokens];
    this.dispatcher.waitFor(tokens);
  }
};


module.exports = StorePrototype;
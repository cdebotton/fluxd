"use strict";

var ACTION_DISPATCHER = require("./Symbols").ACTION_DISPATCHER;
var ACTION_HANDLER = require("./Symbols").ACTION_HANDLER;
var ACTION_UID = require("./Symbols").ACTION_UID;
var ActionCreator = function ActionCreator(dispatcher, name, action, actions) {
  this[ACTION_DISPATCHER] = dispatcher;
  this[ACTION_UID] = name;
  this[ACTION_HANDLER] = action.bind(this);
  this.actions = actions;
};

ActionCreator.prototype.dispatch = function (data) {
  this[ACTION_DISPATCHER].dispatch({
    action: this[ACTION_UID],
    data: data
  });
};

module.exports = ActionCreator;
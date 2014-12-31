"use strict";

var REQUEST_DISPATCHER = require("./Symbols").REQUEST_DISPATCHER;
var REQUEST_HANDLER = require("./Symbols").REQUEST_HANDLER;
var REQUEST_UID = require("./Symbols").REQUEST_UID;
var RequestCreator = function RequestCreator(dispatcher, name, request, requests) {
  this[REQUEST_DISPATCHER] = dispatcher;
  this[REQUEST_UID] = name;
  this[REQUEST_HANDLER] = request.bind(this);
  this.requests = requests;
};

RequestCreator.prototype.request = function (data) {};

RequestCreator.prototype.dispatch = function (data) {
  this[REQUEST_DISPATCHER].dispatch({
    request: this[REQUEST_UID],
    data: data
  });
};

module.exports = RequestCreator;
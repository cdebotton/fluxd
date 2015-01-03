"use strict";

var _slice = Array.prototype.slice;
var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

var Promise = _interopRequire(require("bluebird"));

var Request = _interopRequire(require("superagent"));

var flux = require("../").flux;
var ACTION_DISPATCHER = require("./Symbols").ACTION_DISPATCHER;
var ADAPTER_ROOT = require("./Symbols").ADAPTER_ROOT;
var ADAPTER_RESOURCE = require("./Symbols").ADAPTER_RESOURCE;
var ADAPTER_PENDING = require("./Symbols").ADAPTER_PENDING;
var ADAPTER_ERROR = require("./Symbols").ADAPTER_ERROR;
var ADAPTER_BAD_REQUEST = require("./Symbols").ADAPTER_BAD_REQUEST;
var ADAPTER_TIMEOUT = require("./Symbols").ADAPTER_TIMEOUT;


var TIMEOUT = 10000;

var BaseAdapter = function BaseAdapter() {};

BaseAdapter.prototype.find = function (id) {
  if (id === undefined) id = null;
  var url = makeUrl(this[ADAPTER_ROOT], this[ADAPTER_RESOURCE], id);
  var request = Request.get(url);

  this.dispatch(ADAPTER_PENDING);

  return generatePromise(request).then(digestResponse(this.dispatch.bind(this), this[ADAPTER_RESOURCE]))["catch"](rejectResponse(this[ADAPTER_RESOURCE]));
};

BaseAdapter.prototype.save = function (params) {
  if (params === undefined) params = {};
};

BaseAdapter.prototype.destroy = function (params) {
  if (params === undefined) params = {};
};

module.exports = BaseAdapter;


var makeUrl = function () {
  var parts = _slice.call(arguments);

  return parts.filter(function (p) {
    return !!p;
  }).join("/");
};

var digestResponse = function (dispatch, resource) {
  return function (response) {
    dispatch(response.body);
  };
};


var rejectResponse = function (resource) {
  return function (err) {
    console.error(err);
  };
};

var generatePromise = function (request) {
  return new Promise(function (resolve, reject) {
    request.set("Accept", "application/json").timeout(TIMEOUT).on("error", reject).end(resolve);
  }).cancellable()["catch"](Promise.CancellationError, function (err) {
    request._callback = function () {};
    request.abort();
  });
};
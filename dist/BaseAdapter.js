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


var TIMEOUT = 10000;

var RESOURCE = Symbol("store adapter resource");

var BaseAdapter = function BaseAdapter(root, resource, actions) {
  this[ADAPTER_ROOT] = root;
  this[RESOURCE] = resource;
};

BaseAdapter.prototype.find = function (id) {
  if (id === undefined) id = null;
  var url = makeUrl(this[ADAPTER_ROOT], this[RESOURCE], id);
  var request = Request.get(url);

  return generatePromise(request).then(digestResponse(this[RESOURCE]))["catch"](rejectResponse(this[RESOURCE]));
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

var digestResponse = function (resource) {
  return function (response) {};
};


var rejectResponse = function (resource) {
  return function (err) {};
};

var generatePromise = function (request) {
  return new Promise(function (resolve, reject) {
    request.set("Accept", "application/json").timeout(TIMEOUT).on("error", reject).end(resolve);
  }).cancellable()["catch"](Promise.CancellationError, function (err) {
    request._callback = function () {};
    request.abort();
  });
};
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

BaseAdapter.prototype.find = function () {
  var id = arguments[0] === undefined ? null : arguments[0];
  var url = makeUrl(this[ADAPTER_ROOT], this[ADAPTER_RESOURCE], id);
  this.dispatch(ADAPTER_PENDING);

  var request = Request.get(url);

  return generatePromise(request, this.dispatch.bind(this), this[ADAPTER_RESOURCE]);
};

BaseAdapter.prototype.save = function () {
  var params = arguments[0] === undefined ? {} : arguments[0];
  var parts = [this[ADAPTER_ROOT], this[ADAPTER_RESOURCE]];

  if (params.id) parts.push(params.id);
  this.dispatch(ADAPTER_PENDING);

  var url = makeUrl.apply(null, parts);
  var request = !params.id ? Request.post(url).send(params) : Request.put(url).send(params);

  return generatePromise(request, this.dispatch.bind(this), this[ADAPTER_RESOURCE]);
};

BaseAdapter.prototype.destroy = function () {
  var id = arguments[0] === undefined ? null : arguments[0];
  var url = makeUrl(this[ADAPTER_ROOT], this[ADAPTER_RESOURCE], id);
  var request = Request.del(url);

  return generatePromise(request, this.dispatch.bind(this), this[ADAPTER_RESOURCE]);
};

module.exports = BaseAdapter;


var makeUrl = function () {
  var parts = _slice.call(arguments);

  return parts.filter(function (p) {
    return !!p;
  }).join("/");
};

var digestResponse = function (dispatch, resource) {
  return function (res) {
    if (res.status >= 400 & res.status < 500) {
      dispatch(ADAPTER_BAD_REQUEST, res.body);
    } else if (!res.ok) {
      dispatch(ADAPTER_ERROR, res.body);
    } else {
      dispatch(res.body);
    }
  };
};

var rejectResponse = function (dispatch, resource) {
  return function (err) {
    if (err.timeout === TIMEOUT) {
      dispatch(ADAPTER_TIMEOUT, err);
    } else {
      dispatch(ADAPTER_ERROR, err);
    }
  };
};

var generatePromise = function (request, dispatch, resource) {
  return new Promise(function (resolve, reject) {
    request.set("Accept", "application/json").timeout(TIMEOUT).on("error", reject).end(resolve);
  }).cancellable()["catch"](Promise.CancellationError, function (err) {
    request._callback = function () {};
    request.abort();
  }).then(digestResponse(dispatch, resource))["catch"](rejectResponse(dispatch, resource));
};
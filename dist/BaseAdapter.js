"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var Promise = _interopRequire(require("bluebird"));

var Request = _interopRequire(require("superagent"));

var flux = require("../").flux;
var _Symbols = require("./Symbols");

var ACTION_DISPATCHER = _Symbols.ACTION_DISPATCHER;
var ADAPTER_ROOT = _Symbols.ADAPTER_ROOT;
var ADAPTER_RESOURCE = _Symbols.ADAPTER_RESOURCE;
var ADAPTER_PENDING = _Symbols.ADAPTER_PENDING;
var ADAPTER_ERROR = _Symbols.ADAPTER_ERROR;
var ADAPTER_BAD_REQUEST = _Symbols.ADAPTER_BAD_REQUEST;
var ADAPTER_TIMEOUT = _Symbols.ADAPTER_TIMEOUT;


var TIMEOUT = 10000;

var BaseAdapter = (function () {
  function BaseAdapter() {
    _classCallCheck(this, BaseAdapter);
  }

  _prototypeProperties(BaseAdapter, null, {
    find: {
      value: function find() {
        var id = arguments[0] === undefined ? null : arguments[0];
        var url = makeUrl(this[ADAPTER_ROOT], this[ADAPTER_RESOURCE], id);
        this.dispatch(ADAPTER_PENDING);

        var request = Request.get(url);

        return generatePromise(request, this.dispatch.bind(this), this[ADAPTER_RESOURCE]);
      },
      writable: true,
      configurable: true
    },
    save: {
      value: function save() {
        var params = arguments[0] === undefined ? {} : arguments[0];
        var parts = [this[ADAPTER_ROOT], this[ADAPTER_RESOURCE]];

        if (params.id) parts.push(params.id);
        this.dispatch(ADAPTER_PENDING);

        var url = makeUrl.apply(null, parts);
        var request = !params.id ? Request.post(url).send(params) : Request.put(url).send(params);

        return generatePromise(request, this.dispatch.bind(this), this[ADAPTER_RESOURCE]);
      },
      writable: true,
      configurable: true
    },
    destroy: {
      value: function destroy() {
        var id = arguments[0] === undefined ? null : arguments[0];
        var url = makeUrl(this[ADAPTER_ROOT], this[ADAPTER_RESOURCE], id);
        var request = Request.del(url);

        return generatePromise(request, this.dispatch.bind(this), this[ADAPTER_RESOURCE]);
      },
      writable: true,
      configurable: true
    }
  });

  return BaseAdapter;
})();

module.exports = BaseAdapter;


var makeUrl = function () {
  for (var _len = arguments.length, parts = Array(_len), _key = 0; _key < _len; _key++) {
    parts[_key] = arguments[_key];
  }

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
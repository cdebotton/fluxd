"use strict";

var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

var co = _interopRequire(require("co"));

var DOMReady = _interopRequire(require("./utils/DOMReady"));

var getHandler = _interopRequire(require("./utils/getHandler"));

var fetchData = _interopRequire(require("./utils/fetchData"));

module.exports = function (ReactRouter, Routes) {
  return co(regeneratorRuntime.mark(function callee$1$0() {
    var _ref, Handler, params, query, routes, data;
    return regeneratorRuntime.wrap(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          context$2$0.next = 2;
          return DOMReady();
        case 2:
          context$2$0.next = 4;
          return getHandler(ReactRouter, Routes);
        case 4:
          _ref = context$2$0.sent;
          Handler = _ref.Handler;
          params = _ref.params;
          query = _ref.query;
          routes = _ref.routes;
          context$2$0.next = 11;
          return fetchData(routes, params, query);
        case 11:
          data = context$2$0.sent;
          return context$2$0.abrupt("return", { Handler: Handler, params: params, query: query, routes: routes, data: data });
        case 13:
        case "end":
          return context$2$0.stop();
      }
    }, callee$1$0, this);
  }));
};
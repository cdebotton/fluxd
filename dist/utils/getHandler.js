"use strict";

var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

var Promise = _interopRequire(require("bluebird"));

module.exports = function (ReactRouter, Routes) {
  return new Promise(function (resolve, reject) {
    ReactRouter.run(Routes, ReactRouter.HistoryLocation, function (Handler, state) {
      var routes = state.routes;
      var params = state.params;
      var query = state.query;
      resolve({ Handler: Handler, routes: routes, params: params, query: query });
    });
  });
};
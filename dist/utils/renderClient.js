"use strict";

var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

module.exports = renderClient;
var fetchData = _interopRequire(require("./fetchData"));

function renderClient() {
  ReactRouter.run(Routes, ReactRouter.HistoryLocation, function (Handler, state) {
    var routes = state.routes;
    var params = state.params;
    var query = state.query;


    fetchData(routes, params, query).then(function (data) {
      React.render(React.createElement(Handler, {
        params: params,
        query: query
      }), document);
    });
  });
}
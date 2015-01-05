"use strict";

module.exports = fetchData;
var BOOTSTRAPPED = false;

function fetchData(state) {
  var routes = state.routes;
  var params = state.params;
  var query = state.query;
  var promiseArray = generatePromises(routes, params, query);

  if (!BOOTSTRAPPED) {
    BOOTSTRAPPED = true;
    return Promise.all(promiseArray).then(function (data) {
      return data.reduce(function (memo, item) {
        return Object.assign(memo, item);
      }, {});
    });
  } else {
    return Promise.resolve(true);
  }
}

function generatePromises(routes, params, query) {
  return routes.filter(function (route) {
    return route.handler.fetchData;
  }).map(function (route) {
    return new Promise(function (resolve, reject) {
      route.handler.fetchData(params, query).then(resolve)["catch"](reject);
    });
  });
}
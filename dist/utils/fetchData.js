"use strict";

module.exports = fetchData;
function fetchData(routes, params, query) {
  var promiseArray = generatePromises(routes, params, query);

  return Promise.all(promiseArray).then(function (data) {
    return data.reduce(function (memo, item) {
      return Object.assign(memo, item);
    }, {});
  });
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
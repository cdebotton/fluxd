var BOOTSTRAPPED = false;

export default function fetchData(state) {
  var {routes, params, query} = state;
  var promiseArray = generatePromises(routes, params, query);

  if (! BOOTSTRAPPED) {
    BOOTSTRAPPED = true;
    return Promise.all(promiseArray)
      .then(data => data.reduce((memo, item) => {
        return Object.assign(memo, item);
      }, {}));
  }
  else {
    return Promise.resolve(true);
  }
};

function generatePromises(routes, params, query) {
  return routes.filter(route => route.handler.fetchData)
    .map(route => {
      return new Promise((resolve, reject) => {
        route.handler.fetchData(params, query)
          .then(resolve)
          .catch(reject);
      });
    });
}

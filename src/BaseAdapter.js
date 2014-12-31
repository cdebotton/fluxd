import Promise from 'bluebird';
import Request from 'superagent';
import {flux} from '../';
import {ACTION_DISPATCHER, ADAPTER_ROOT} from './Symbols';

const TIMEOUT = 10000

const RESOURCE = Symbol('store adapter resource');

export default class BaseAdapter {
  constructor(root, resource, actions) {
    this[ADAPTER_ROOT] = root;
    this[RESOURCE] = resource;
  }

  find(id = null) {
    var url = makeUrl(this[ADAPTER_ROOT], this[RESOURCE], id);
    var request = Request.get(url);

    return generatePromise(request)
      .then(digestResponse(this[RESOURCE]))
      .catch(rejectResponse(this[RESOURCE]));
  }

  save(params = {}) {

  }

  destroy(params = {}) {

  }
}

var makeUrl = (...parts) => parts.filter(p => !!p).join('/');

var digestResponse = (resource) => {
  return function(response) {

  };
};


var rejectResponse = (resource) => {
  return function(err) {

  }
};

var generatePromise = (request) => {
  return new Promise((resolve, reject) => {
    request.set('Accept', 'application/json')
      .timeout(TIMEOUT)
      .on('error', reject)
      .end(resolve);
  })
  .cancellable()
  .catch(Promise.CancellationError, function(err) {
    request._callback = function() {};
    request.abort();
  });
};

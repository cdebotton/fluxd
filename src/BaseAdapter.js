import Promise from 'bluebird';
import Request from 'superagent';
import {flux} from '../';
import {
  ACTION_DISPATCHER, ADAPTER_ROOT, ADAPTER_RESOURCE,
  ADAPTER_PENDING, ADAPTER_ERROR, ADAPTER_BAD_REQUEST,
  ADAPTER_TIMEOUT
} from './Symbols';

const TIMEOUT = 10000

export default class BaseAdapter {
  find(id = null) {
    var url = makeUrl(this[ADAPTER_ROOT], this[ADAPTER_RESOURCE], id);
    var request = Request.get(url);

    this.dispatch(ADAPTER_PENDING);

    return generatePromise(request)
      .then(digestResponse(this.dispatch.bind(this), this[ADAPTER_RESOURCE]))
      .catch(rejectResponse(this[ADAPTER_RESOURCE]));
  }

  save(params = {}) {

  }

  destroy(params = {}) {

  }
}

var makeUrl = (...parts) => parts.filter(p => !!p).join('/');

var digestResponse = (dispatch, resource) => {
  return function(response) {
    dispatch(response.body);
  };
};


var rejectResponse = (resource) => {
  return function(err) {
    console.error(err);
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

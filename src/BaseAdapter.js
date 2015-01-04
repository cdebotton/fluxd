import Promise from 'bluebird';
import Request from 'superagent';
import {flux} from '../';
import {
  ACTION_DISPATCHER, ADAPTER_ROOT, ADAPTER_RESOURCE,
  ADAPTER_PENDING, ADAPTER_ERROR, ADAPTER_BAD_REQUEST,
  ADAPTER_TIMEOUT
} from './Symbols';

const TIMEOUT = 10000;

export default class BaseAdapter {
  find(id = null) {
    var url = makeUrl(this[ADAPTER_ROOT], this[ADAPTER_RESOURCE], id);
    this.dispatch(ADAPTER_PENDING);

    var request = Request.get(url);

    return generatePromise(
      request,
      this.dispatch.bind(this),
      this[ADAPTER_RESOURCE]
    );
  }

  save(params = {}) {
    var parts = [this[ADAPTER_ROOT], this[ADAPTER_RESOURCE]];

    if (params.id) parts.push(params.id);
    this.dispatch(ADAPTER_PENDING);

    var url = makeUrl.apply(null, parts);
    var request = !params.id ?
      Request.post(url).send(params) :
      Request.put(url).send(params);

    return generatePromise(
      request,
      this.dispatch.bind(this),
      this[ADAPTER_RESOURCE]
    );
  }

  destroy(id = null) {
    var url = makeUrl(this[ADAPTER_ROOT], this[ADAPTER_RESOURCE], id);
    var request = Request.del(url);

    return generatePromise(
      request,
      this.dispatch.bind(this),
      this[ADAPTER_RESOURCE]
    );
  }
}

var makeUrl = (...parts) => parts.filter(p => !!p).join('/');

var digestResponse = (dispatch, resource) => {
  return function(res) {
    if (res.status >= 400 & res.status < 500) {
      dispatch(ADAPTER_BAD_REQUEST, res.body);
    }
    else if(! res.ok) {
      dispatch(ADAPTER_ERROR, res.body);
    }
    else {
      dispatch(res.body);
    }
  };
};

var rejectResponse = (dispatch, resource) => {
  return function(err) {
    if (err.timeout === TIMEOUT) {
      dispatch(ADAPTER_TIMEOUT, err);
    }
    else {
      dispatch(ADAPTER_ERROR, err);
    }
  }
};

var generatePromise = (request, dispatch, resource) => {
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
  })
  .then(digestResponse(dispatch, resource))
  .catch(rejectResponse(dispatch, resource));
};

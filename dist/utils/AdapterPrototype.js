"use strict";

var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

var Promise = _interopRequire(require("bluebird"));

var Request = _interopRequire(require("superagent"));

var AdapterPrototype = {
  resource: null,

  find: function (id) {
    var _this = this;
    if (id === undefined) id = null;
    return new Promise(function (resolve, reject) {
      var url = makeUrl(_this.resource, id);
      Request.get(url).on("error", reject).end(digestResponse(resolve, reject));
    });
  },

  create: function (params) {
    if (params === undefined) params = {};
  },

  update: function (id, params) {
    if (params === undefined) params = {};
  },

  destroy: function (id) {}
};

function digestResponse(resolve, reject) {
  return function (res) {
    if (res.status >= 400 && res.status < 500) {
      reject("BAD REQUEST");
    } else if (!res.ok) {
      reject("ERROR");
    } else {
      resolve(res.body);
    }
  };
}

function makeUrl(resource, id) {
  var parts = [trimUrlResources(resource)];
  if (id) parts.push(id);

  return "http://localhost:3000/api/v1/" + parts.join("/");
}

function trimUrlResources(part) {
  return part.trim().replace(/^\/|\/$/, "");
}
module.exports = AdapterPrototype;
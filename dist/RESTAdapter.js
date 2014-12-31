"use strict";

var flux = require("../").flux;
var RESTAdapter = function RESTAdapter(root, resource) {
  this.root = trimForURL(root);
  this.resource = trimForURL(resource);
};

RESTAdapter.prototype.makeUrl = function () {
  return "/" + this.root + "/" + this.resource;
};

module.exports = RESTAdapter;


function trimForURL(url) {
  return url.trim().replace(/^\/+|\/+$/, "");
}
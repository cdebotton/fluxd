"use strict";

var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

var Fluxd = _interopRequire(require("./Fluxd"));

var StoreListenerMixin = _interopRequire(require("./StoreListener"));

var flux = new Fluxd();

exports.flux = flux;
exports.StoreListenerMixin = StoreListenerMixin;
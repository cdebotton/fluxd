"use strict";

var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

var Promise = _interopRequire(require("bluebird"));

module.exports = function () {
  return new Promise(function (resolve, reject) {
    if (typeof window === "undefined") {
      return resolve();
    }

    setTimeout(reject, 5000);
    document.addEventListener("DOMContentLoaded", resolve, false);
  });
};
"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var NoopClass = _interopRequire(require("./noop"));

var builtIns = Object.getOwnPropertyNames(NoopClass);
var builtInProto = Object.getOwnPropertyNames(NoopClass.prototype);

var getInternalMethods = function (obj, excluded) {
  return Object.getOwnPropertyNames(obj).reduce(function (value, m) {
    if (excluded.indexOf(m) !== -1) {
      return value;
    }

    value[m] = obj[m];
    return value;
  }, {});
};

exports.builtIns = builtIns;
exports.builtInProto = builtInProto;
exports.getInternalMethods = getInternalMethods;
exports.__esModule = true;
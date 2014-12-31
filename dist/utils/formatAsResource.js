"use strict";

var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

module.exports = formatAsResource;
var pluralize = _interopRequire(require("pluralize"));

function formatAsResource(name) {
  return pluralize(name.replace(/[a-z]([A-Z])/g, function (i) {
    return "" + i[0] + "-" + i[1].toLowerCase();
  }).toLowerCase().replace(/\-adapter$/, ""));
}
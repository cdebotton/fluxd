"use strict";

var _hasOwn = Object.prototype.hasOwnProperty;
var MIXIN_REGISTRY = require("./Symbols").MIXIN_REGISTRY;
module.exports = {
  componentWillUnmount: function () {
    this[MIXIN_REGISTRY] && this[MIXIN_REGISTRY].forEach(function (x) {
      x.store.unlisten(x.handler);
    });
  },

  listenTo: function (store, handler) {
    if (!_hasOwn.call(this, "MIXIN_REGISTRY")) this.MIXIN_REGISTRY = [];
    this[MIXIN_REGISTRY].push({ store: store, handler: handler });
    store.listen(handler);
  }
};
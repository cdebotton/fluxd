"use strict";

var MIXIN_REGISTRY = require("./Symbols").MIXIN_REGISTRY;
module.exports = {
  componentWillUnmount: function componentWillUnmount() {
    this[MIXIN_REGISTRY] && this[MIXIN_REGISTRY].forEach(function (x) {
      x.store.unlisten(x.handler);
    });
  },

  listenTo: function listenTo(store, handler) {
    this[MIXIN_REGISTRY] = this[MIXIN_REGISTRY] || [];
    this[MIXIN_REGISTRY].push({ store: store, handler: handler });
    store.listen(handler);
  }
};
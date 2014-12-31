"use strict";

var _slice = Array.prototype.slice;
module.exports = function (BaseClass) {
  var actions = Object.assign({}, getInternalMethods(ActionsClass.prototype, builtInProto));

  ActionsClass.call({
    generateActions: function () {
      var actionNames = _slice.call(arguments);

      actionNames.forEach(function (actionName) {
        actions[actionName] = function (x) {
          var a = _slice.call(arguments, 1);

          this.dispatch(a.length ? [x].concat(a) : x);
        };
      });
    }
  });
};
import {MIXIN_REGISTRY} from './Symbols';

export default {
  componentWillUnmount() {
    this[MIXIN_REGISTRY] && this[MIXIN_REGISTRY].forEach(x => {
      x.store.unlisten(x.handler);
    });
  },

  listenTo(store, handler) {
    this[MIXIN_REGISTRY] ?= [];
    this[MIXIN_REGISTRY].push({store: store, handler: handler});
    store.listen(handler);
  }
};

import {ACTION_KEY, LISTENERS, ACTION_BINDING} from '../Symbols';

var StorePrototype = {
  bindAction(symbol, handler) {
    if (!symbol) {
      throw new ReferenceError('Invalid action reference');
    }
    if (typeof handler !== 'function') {
      throw new TypeError('bindAction expects a function');
    }

    if (handler.length > 1) {
      throw new TypeError(
        `Action handler in store ${this._storeName} for ` +
        `${(symbol[ACTION_KEY] || symbol)} was defined with more than ` +
        `one paremeter. Only a single paramter is passed through the ` +
        `dispatcher, did you mean to pass in an Object instead?`
      );
    }

    if (symbol[ACTION_KEY]) {
      this[LISTENERS][symbol[ACTION_KEY]] = handler.bind(this);
    }
    else {
      this[LISTENERS][symbol] = handler.bind(this);
    }
  },

  bindActions(actions) {
    Object.keys(actions).forEach(action => {
      var symbol = actions[action];
      var binding = actions[action][ACTION_BINDING] || action;
      var assumedEventHandler = binding.replace(/./, x => `on${x[0].toUpperCase()}`);
      var handler = null;

      if (this[binding] && this[assumedEventHandler]) {
        throw new ReferenceError(
          `You have multiple action handlers bound to an action: ` +
          `${action} and ${assumedEventHandler}`
        );
      }
      else if (this[binding]) {
        handler = this[binding];
      }
      else if (this[assumedEventHandler]) {
        handler = this[assumedEventHandler];
      }

      if (handler) {
        this.bindAction(symbol, handler);
      }
    });
  },

  waitFor(tokens) {
    if (! tokens) {
      throw new ReferenceError('Dispatch tokens not provided');
    }

    tokens = Array.isArray(tokens) ? tokens : [tokens];
    this.dispatcher.waitFor(tokens);
  }
};


export default StorePrototype;

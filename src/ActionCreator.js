import {ACTION_DISPATCHER, ACTION_HANDLER, ACTION_UID} from './Symbols';

export default class ActionCreator {
  constructor(dispatcher, name, action, actions) {
    this[ACTION_DISPATCHER] = dispatcher;
    this[ACTION_UID] = name;
    this[ACTION_HANDLER] = action.bind(this);
    this.actions = actions;
  }

  dispatch(data) {
    this[ACTION_DISPATCHER].dispatch({
      action: this[ACTION_UID],
      data: data
    });
  }
};

import {
  ACTION_DISPATCHER, ACTION_HANDLER, ACTION_UID,
  ADAPTER_ROOT, ADAPTER_RESOURCE
} from './Symbols';

export default class ActionCreator {
  constructor(dispatcher, name, action, actions, root, resource) {
    this[ACTION_DISPATCHER] = dispatcher;
    this[ACTION_UID] = name;
    this[ACTION_HANDLER] = action.bind(this);

    if (root) {
      this[ADAPTER_ROOT] = root;
    }

    if (resource) {
      this[ADAPTER_RESOURCE] = resource;
    }

    this.actions = actions;
  }

  dispatch(data) {
    this[ACTION_DISPATCHER].dispatch({
      action: this[ACTION_UID],
      data: data
    });
  }
};

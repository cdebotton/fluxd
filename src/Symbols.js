import Symbol from './polyfills/es6-symbol';

var now = Date.now();
var VariableSymbol = (desc) => Symbol(`${now}${desc}`);

export const ACTION_DISPATCHER = Symbol('action dispatcher storage');
export const ACTION_HANDLER = Symbol('action creator handler');
export const ACTION_UID = Symbol('the actions uid name');
export const ACTION_BINDING = Symbol('the action binding key');
export const ACTION_KEY = Symbol('holds the actions uid symbol for listening');
export const ADAPTERS_STORE = Symbol('adapters storage');
export const ADAPTER_RESOURCE = Symbol('stores the resource of the adapter');
export const ADAPTER_ROOT = Symbol('stores the root url of the adapter');
export const CHANGE_EVENT = Symbol('store change event');
export const EVENT_EMITTER = Symbol('event emitter instance');
export const STORE_BOOTSTRAP = Symbol('event handler onBootstrap');
export const STORE_SNAPSHOT = Symbol('event handler onTakeSnapshot');
export const LISTENERS = Symbol('stores action listeners storage');
export const STORES_STORE = Symbol('stores storage');
export const MIXIN_REGISTRY = Symbol('_fluxd store listener registry_');
export const STATE_CONTAINER = VariableSymbol('fluxd state container');
export const BOOTSTRAP_FLAG = VariableSymbol('have you bootstrapped yet?');

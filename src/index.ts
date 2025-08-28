export type {
  ImmutableEntities,
  ImmutablePlugin,
  ImmutablePlugins,
  PluginURN,
} from './types.js';

export { ImmutableEntityCollection } from './collection.js';
export { ImmutableHost } from './host.js';
export {
  isEntityRecord,
  isPlainObject,
  isImmutablePlugin,
  assertImmutablePlugins,
} from './guards.js';

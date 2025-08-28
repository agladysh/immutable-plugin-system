export type {
  ImmutableEntities,
  ImmutablePlugin,
  ImmutablePlugins,
  PluginURN,
  ImmutableEntityKey,
  ImmutableEntitiesRecord,
} from './types.js';

export { ImmutableEntityCollection } from './collection.js';
export { ImmutableHost } from './host.js';
export {
  isEntityRecord,
  isPlainObject,
  assertPlainObject,
  assertEntityRecord,
  isEntitiesRecord,
  isImmutablePlugin,
  isImmutablePlugins,
  assertImmutablePlugin,
  assertImmutablePlugins,
  assertEntitiesRecord,
} from './guards.js';

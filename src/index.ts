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
export { isPlainObject, assertPlainObject } from './guards/plain-object.js';
export { isEntityRecord, assertEntityRecord } from './guards/entity-record.js';
export {
  isEntitiesRecord,
  assertEntitiesRecord,
} from './guards/entities-record.js';
export { isImmutablePlugin, assertImmutablePlugin } from './guards/plugin.js';
export {
  isImmutablePlugins,
  assertImmutablePlugins,
} from './guards/plugins.js';

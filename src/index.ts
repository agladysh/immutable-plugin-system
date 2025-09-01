export type {
  ImmutableEntities,
  ImmutablePlugin,
  ImmutablePlugins,
  PluginURN,
  ImmutableEntityKey,
  ImmutableEntitiesRecord,
  NonEmptyString,
} from './types.js';

export { ImmutableEntityCollection } from './ImmutableEntityCollection.js';
export { ImmutableHost } from './ImmutableHost.js';
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

// XXX: This file is technical debt. Remove it after adding any real test files
import { expectType, expectError } from 'tsd';
import type { ImmutablePlugin, ImmutableEntities, PluginURN } from '..';

// Basic import and type shape checks
type Entities = {
  assets: ImmutableEntities<string, string>;
};

declare const plugin: ImmutablePlugin<Entities>;
expectType<PluginURN>(plugin.name);
expectType<Readonly<Entities>>(plugin.entities);

// Invalid plugin missing required entity type must fail
expectError({
  name: 'bad',
  entities: {},
} satisfies ImmutablePlugin<Entities>);

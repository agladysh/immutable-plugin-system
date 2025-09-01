import { expectType, expectError } from 'tsd';
import type {
  ImmutableEntities,
  ImmutablePlugin,
  ImmutablePlugins,
  PluginURN,
  ImmutableEntityCollection,
} from '..';
import { ImmutableHost } from '..';

// Host with simple entity structure
type SimpleEntities = {
  assets: ImmutableEntities<string, string>;
  commands: ImmutableEntities<string, () => string>;
};

type SimplePlugin = ImmutablePlugin<SimpleEntities>;
type SimplePlugins = ImmutablePlugins<SimplePlugin>;
type SimpleHost = ImmutableHost<SimplePlugin>;

declare const simplePlugins: SimplePlugins;
declare const simpleHost: SimpleHost;

// Entity collection derivation from plugin type
expectType<ImmutableEntityCollection<string, string>>(
  simpleHost.entities.assets
);
expectType<ImmutableEntityCollection<string, () => string>>(
  simpleHost.entities.commands
);

// Host with mixed key types
type MixedKeyEntities = {
  stringKeys: ImmutableEntities<string, { value: number }>;
  symbolKeys: ImmutableEntities<symbol, boolean>;
  mixedKeys: ImmutableEntities<string | symbol, {}>;
};

type MixedKeyPlugin = ImmutablePlugin<MixedKeyEntities>;
type MixedKeyHost = ImmutableHost<MixedKeyPlugin>;

declare const mixedKeyHost: MixedKeyHost;

expectType<ImmutableEntityCollection<string, { value: number }>>(
  mixedKeyHost.entities.stringKeys
);
expectType<ImmutableEntityCollection<symbol, boolean>>(
  mixedKeyHost.entities.symbolKeys
);
expectType<ImmutableEntityCollection<string | symbol, {}>>(
  mixedKeyHost.entities.mixedKeys
);

// Host with optional entity types
type OptionalEntities = {
  required: ImmutableEntities<string, string>;
  optional?: ImmutableEntities<string, number>;
  alsoOptional?: ImmutableEntities<symbol, boolean>;
};

type OptionalPlugin = ImmutablePlugin<OptionalEntities>;
type OptionalHost = ImmutableHost<OptionalPlugin>;

declare const optionalHost: OptionalHost;

// Required entity type is always present
expectType<ImmutableEntityCollection<string, string>>(
  optionalHost.entities.required
);

// Optional entity types handling - these properties may not exist at runtime
// but are accessible through the type system for optional properties

// Host with complex nested entity types
type ComplexEntity = {
  metadata: {
    id: string;
    version: number;
    tags: string[];
  };
  config: {
    enabled: boolean;
    options?: Record<string, unknown>;
  };
  handlers: {
    onCreate: () => void;
    onUpdate: (data: unknown) => boolean;
  };
};

type ComplexEntities = {
  complex: ImmutableEntities<string, ComplexEntity>;
  simple: ImmutableEntities<symbol, string>;
};

type ComplexPlugin = ImmutablePlugin<ComplexEntities>;
type ComplexHost = ImmutableHost<ComplexPlugin>;

declare const complexHost: ComplexHost;

// Complex type preservation through host
expectType<ImmutableEntityCollection<string, ComplexEntity>>(
  complexHost.entities.complex
);
expectType<ImmutableEntityCollection<symbol, string>>(
  complexHost.entities.simple
);

// Access complex entity properties through collection methods
const complexEntities = complexHost.entities.complex.get('someKey');
expectType<ComplexEntity[]>(complexEntities);

if (complexEntities.length > 0) {
  const firstEntity = complexEntities[0];
  expectType<string>(firstEntity.metadata.id);
  expectType<number>(firstEntity.metadata.version);
  expectType<string[]>(firstEntity.metadata.tags);
  expectType<boolean>(firstEntity.config.enabled);
  expectType<Record<string, unknown> | undefined>(firstEntity.config.options);
  expectType<() => void>(firstEntity.handlers.onCreate);
  expectType<(data: unknown) => boolean>(firstEntity.handlers.onUpdate);
}

// Host constructor options with requiredEntityTypes
declare const pluginsForOptions: ImmutablePlugins<SimplePlugin>;

expectType<SimpleHost>(new ImmutableHost(pluginsForOptions));
expectType<SimpleHost>(new ImmutableHost(pluginsForOptions, {}));
expectType<SimpleHost>(
  new ImmutableHost(pluginsForOptions, { requiredEntityTypes: ['assets'] })
);
expectType<SimpleHost>(
  new ImmutableHost(pluginsForOptions, {
    requiredEntityTypes: ['assets', 'commands'],
  })
);
expectType<SimpleHost>(
  new ImmutableHost(pluginsForOptions, { requiredEntityTypes: [] })
);

// Host constructor with symbol entity types in requiredEntityTypes
type SymbolEntityPlugin = ImmutablePlugin<{
  symbolType: ImmutableEntities<string, string>;
  stringType: ImmutableEntities<string, number>;
}>;

declare const symbolPlugins: ImmutablePlugins<SymbolEntityPlugin>;

expectType<ImmutableHost<SymbolEntityPlugin>>(
  new ImmutableHost(symbolPlugins, { requiredEntityTypes: ['symbolType'] })
);
expectType<ImmutableHost<SymbolEntityPlugin>>(
  new ImmutableHost(symbolPlugins, {
    requiredEntityTypes: ['stringType', 'symbolType'],
  })
);

// Multiple plugin types in single host
type PluginA = ImmutablePlugin<{
  assets: ImmutableEntities<string, string>;
  commands: ImmutableEntities<string, () => void>;
}>;

type PluginB = ImmutablePlugin<{
  assets: ImmutableEntities<string, string>;
  events: ImmutableEntities<symbol, () => boolean>;
}>;

// Host must have consistent plugin type - different entity structures
const inconsistentPlugins: ImmutablePlugins<PluginB> = {} as any;
expectError(() => new ImmutableHost<PluginA>(inconsistentPlugins));

// But can work with plugins that share the same entity structure
type SharedEntities = {
  shared: ImmutableEntities<string, string>;
};

type SharedPluginA = ImmutablePlugin<SharedEntities> & { typeA: true };
type SharedPluginB = ImmutablePlugin<SharedEntities> & { typeB: true };

// This works because both plugins have the same entity structure
type UnionPlugin = SharedPluginA | SharedPluginB;
declare const unionPlugins: ImmutablePlugins<UnionPlugin>;
expectType<ImmutableHost<UnionPlugin>>(new ImmutableHost(unionPlugins));

// Host entity collection access patterns
declare const testHost: SimpleHost;

// Direct property access
expectType<ImmutableEntityCollection<string, string>>(testHost.entities.assets);

// Property access through bracket notation
expectType<ImmutableEntityCollection<string, string>>(
  testHost.entities['assets']
);

// Method chaining with entity collections
const assetEntities = testHost.entities.assets.get('logo');
expectType<string[]>(assetEntities);

const assetCount = testHost.entities.assets.map((entities, key) => ({
  key,
  count: entities.length,
}));
expectType<{ key: string; count: number }[]>(assetCount);

const allAssets = testHost.entities.assets.flat();
expectType<[string, string, PluginURN][]>(allAssets);

// Entity discovery across multiple plugins
for (const [asset, key, pluginURN] of testHost.entities.assets) {
  expectType<string>(asset);
  expectType<string>(key);
  expectType<PluginURN>(pluginURN);
}

for (const [command, key, pluginURN] of testHost.entities.commands) {
  expectType<() => string>(command);
  expectType<string>(key);
  expectType<PluginURN>(pluginURN);
}

// Host properties are readonly
expectError(() => {
  testHost.plugins = {} as never;
});
expectError(() => {
  testHost.entities = {} as never;
});
expectError(() => {
  testHost.entities.assets = {} as never;
});

// Host generic parameter inference
declare const inferredPlugins: ImmutablePlugins<
  ImmutablePlugin<{
    type1: ImmutableEntities<string, string>;
  }>
>;

// TypeScript should infer the plugin type from the plugins parameter
const inferredHost = new ImmutableHost(inferredPlugins);
expectType<ImmutableEntityCollection<string, string>>(
  inferredHost.entities.type1
);

// Empty entities plugin support
type EmptyEntitiesPlugin = ImmutablePlugin<{}>;
type EmptyHost = ImmutableHost<EmptyEntitiesPlugin>;

declare const emptyPlugins: ImmutablePlugins<EmptyEntitiesPlugin>;
expectType<EmptyHost>(new ImmutableHost(emptyPlugins));

// Single entity type host
type SingleEntityPlugin = ImmutablePlugin<{
  onlyType: ImmutableEntities<string, { single: true }>;
}>;

declare const singlePlugins: ImmutablePlugins<SingleEntityPlugin>;
declare const singleHost: ImmutableHost<SingleEntityPlugin>;

expectType<ImmutableEntityCollection<string, { single: true }>>(
  singleHost.entities.onlyType
);

// Large number of entity types
type ManyEntities = {
  type1: ImmutableEntities<string, string>;
  type2: ImmutableEntities<string, number>;
  type3: ImmutableEntities<string, boolean>;
  type4: ImmutableEntities<symbol, string>;
  type5: ImmutableEntities<symbol, number>;
  type6: ImmutableEntities<string | symbol, {}>;
};

type ManyTypesPlugin = ImmutablePlugin<ManyEntities>;
type ManyTypesHost = ImmutableHost<ManyTypesPlugin>;

declare const manyTypesHost: ManyTypesHost;

expectType<ImmutableEntityCollection<string, string>>(
  manyTypesHost.entities.type1
);
expectType<ImmutableEntityCollection<string, number>>(
  manyTypesHost.entities.type2
);
expectType<ImmutableEntityCollection<string, boolean>>(
  manyTypesHost.entities.type3
);
expectType<ImmutableEntityCollection<symbol, string>>(
  manyTypesHost.entities.type4
);
expectType<ImmutableEntityCollection<symbol, number>>(
  manyTypesHost.entities.type5
);
expectType<ImmutableEntityCollection<string | symbol, {}>>(
  manyTypesHost.entities.type6
);

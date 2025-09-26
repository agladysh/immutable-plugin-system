import { expectType, expectError, expectAssignable } from 'tsd';
import type {
  PluginURN,
  ImmutableEntityKey,
  ImmutableEntities,
  ImmutableEntitiesRecord,
  ImmutablePlugin,
  ImmutablePlugins,
  NonEmptyString,
} from '..';

// PluginURN tests
declare const pluginUrn: PluginURN;
expectType<string>(pluginUrn);

// PluginURN is just string, so it accepts any string
declare const validUrn1: string;
declare const validUrn2: string;
expectType<PluginURN>(validUrn1);
expectType<PluginURN>(validUrn2);

// Invalid plugin URNs should still be strings
expectError<PluginURN>(123);
expectError<PluginURN>(null);
expectError<PluginURN>(undefined);

// ImmutableEntityKey tests
declare const entityKey: ImmutableEntityKey;
// ImmutableEntityKey is assignable to PropertyKey
expectAssignable<PropertyKey>(entityKey);

// Invalid entity keys: enforced via ImmutableEntities generic elsewhere

// ImmutableEntities tests
type StringEntities = ImmutableEntities<'key1' | 'key2', string>;
type SymbolEntities = ImmutableEntities<symbol, number>;
type MixedKeyEntities = ImmutableEntities<'key1' | symbol, {}>;

declare const stringEntities: StringEntities;
declare const symbolEntities: SymbolEntities;
declare const mixedKeyEntities: MixedKeyEntities;

// Readonly enforcement
expectType<Readonly<Record<'key1' | 'key2', string>>>(stringEntities);
expectType<Readonly<Record<symbol, number>>>(symbolEntities);
expectType<Readonly<Record<'key1' | symbol, {}>>>(mixedKeyEntities);

// Generic parameter behavior - use specific literal unions instead of broad string
type TestStringEntities = ImmutableEntities<'key1' | 'key2', string>;
type TestSpecificEntities = ImmutableEntities<'key1' | 'key2', string>;
type TestObjectEntities = ImmutableEntities<
  'objKey1' | 'objKey2',
  { prop: boolean }
>;

declare const testStringEntities: TestStringEntities;
declare const testSpecificEntities: TestSpecificEntities;
declare const testObjectEntities: TestObjectEntities;

expectType<Readonly<Record<'key1' | 'key2', string>>>(testStringEntities);
expectType<Readonly<Record<'key1' | 'key2', string>>>(testSpecificEntities);
expectType<Readonly<Record<'objKey1' | 'objKey2', { prop: boolean }>>>(
  testObjectEntities
);

// ImmutableEntitiesRecord tests
type DefaultEntitiesRecord = ImmutableEntitiesRecord;
type TypedEntitiesRecord = ImmutableEntitiesRecord<
  'key1' | 'key2',
  { data: string }
>;

declare const defaultRecord: DefaultEntitiesRecord;
declare const typedRecord: TypedEntitiesRecord;

// Default parameters behavior
// Default EntitiesRecord uses broad string | symbol for inner keys
expectType<
  Readonly<Record<PropertyKey, ImmutableEntities<string | symbol, unknown>>>
>(defaultRecord);

// Typed parameters behavior
expectType<
  Readonly<
    Record<PropertyKey, ImmutableEntities<'key1' | 'key2', { data: string }>>
  >
>(typedRecord);

// Readonly enforcement
expectType<
  Readonly<
    Record<PropertyKey, Readonly<Record<'key1' | 'key2', { data: string }>>>
  >
>(typedRecord);

// Nested structure validation - use type variables
type TestNestedEntitiesRecord = ImmutableEntitiesRecord<
  'key1' | 'key2',
  string
>;
declare const testNestedEntitiesRecord: TestNestedEntitiesRecord;
expectType<
  Readonly<Record<PropertyKey, Readonly<Record<'key1' | 'key2', string>>>>
>(testNestedEntitiesRecord);

// ImmutablePlugin tests
type BasicPlugin = ImmutablePlugin<{
  assets: ImmutableEntities<'asset1' | 'asset2', string>;
  commands: ImmutableEntities<'cmd1' | 'cmd2', () => void>;
}>;

declare const basicPlugin: BasicPlugin;

// Plugin structure validation
expectType<PluginURN>(basicPlugin.name);
expectType<
  Readonly<{
    assets: ImmutableEntities<'asset1' | 'asset2', string>;
    commands: ImmutableEntities<'cmd1' | 'cmd2', () => void>;
  }>
>(basicPlugin.entities);

// Plugin with default generic
type DefaultPlugin = ImmutablePlugin;
declare const defaultPlugin: DefaultPlugin;
expectType<PluginURN>(defaultPlugin.name);
expectType<Readonly<ImmutableEntitiesRecord>>(defaultPlugin.entities);

// Plugin with optional entity types
type OptionalEntitiesPlugin = ImmutablePlugin<{
  required: ImmutableEntities<'req1' | 'req2', string>;
  optional?: ImmutableEntities<'opt1' | 'opt2', number>;
}>;

declare const optionalPlugin: OptionalEntitiesPlugin;
expectType<PluginURN>(optionalPlugin.name);
expectType<
  Readonly<{
    required: ImmutableEntities<'req1' | 'req2', string>;
    optional?: ImmutableEntities<'opt1' | 'opt2', number>;
  }>
>(optionalPlugin.entities);

// ImmutablePlugins tests
type BasicPlugins = ImmutablePlugins<BasicPlugin>;
type DefaultPlugins = ImmutablePlugins;

declare const basicPlugins: BasicPlugins;
declare const defaultPlugins: DefaultPlugins;

// Plugins record structure
expectType<Readonly<Record<PluginURN, BasicPlugin>>>(basicPlugins);
expectType<Readonly<Record<PluginURN, ImmutablePlugin>>>(defaultPlugins);

// Readonly enforcement for plugins record
expectType<Readonly<Record<string, BasicPlugin>>>(basicPlugins);

// Plugin access by URN
expectType<BasicPlugin>(basicPlugins['some-plugin-urn']);
expectType<ImmutablePlugin>(defaultPlugins['any-plugin-urn']);

// Generic parameter propagation
type ComplexPlugin = ImmutablePlugin<{
  type1: ImmutableEntities<'someKey', { value: number }>;
  type2: ImmutableEntities<symbol, string[]>;
}>;

type ComplexPlugins = ImmutablePlugins<ComplexPlugin>;
declare const complexPlugins: ComplexPlugins;
expectType<ComplexPlugin>(complexPlugins['complex-plugin']);
expectType<{ value: number }>(
  complexPlugins['complex-plugin'].entities.type1['someKey']
);
expectType<string[]>(
  complexPlugins['complex-plugin'].entities.type2[Symbol('someSymbol')]
);

// ImmutableEntityCollection tests
import type { ImmutableEntityCollection } from '..';

declare const stringCollection: ImmutableEntityCollection<string, string>;
declare const symbolCollection: ImmutableEntityCollection<symbol, number>;

// size property
expectType<number>(stringCollection.size);
expectType<number>(symbolCollection.size);

// keys method
expectType<IterableIterator<string>>(stringCollection.keys());
expectType<IterableIterator<symbol>>(symbolCollection.keys());

// values method
expectType<IterableIterator<string[]>>(stringCollection.values());
expectType<IterableIterator<number[]>>(symbolCollection.values());

// Integration with for-of loops
for (const key of stringCollection.keys()) {
  expectType<string>(key);
}
for (const values of stringCollection.values()) {
  expectType<string[]>(values);
}
for (const [key, values] of stringCollection.entries()) {
  expectType<string>(key);
  expectType<string[]>(values);
}

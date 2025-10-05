import { expectType, expectError } from 'tsd';
import type {
  ImmutableEntityKey,
  ImmutableEntities,
  ImmutableEntitiesRecord,
  ImmutablePlugin,
  ImmutablePlugins,
  PluginURN,
  ImmutableEntityCollection,
  NonEmptyString,
} from '..';
import { ImmutableHost } from '..';

// Edge case: Plugin with no entities (empty object)
type EmptyEntitiesPlugin = ImmutablePlugin<{}>;
const emptyPlugin: EmptyEntitiesPlugin = {
  name: 'empty-plugin',
  entities: {},
} as const;
expectType<EmptyEntitiesPlugin>(emptyPlugin);

const emptyPlugins: ImmutablePlugins<EmptyEntitiesPlugin> = {
  'empty-plugin': emptyPlugin,
} as const;

const emptyHost = new ImmutableHost(emptyPlugins);
expectType<ImmutableHost<EmptyEntitiesPlugin>>(emptyHost);

// Edge case: Plugin with single entity type
type SingleEntityPlugin = ImmutablePlugin<{
  single: ImmutableEntities<string, { value: string }>;
}>;

const singlePlugin: SingleEntityPlugin = {
  name: 'single-plugin',
  entities: {
    single: { key: { value: 'test' } },
  },
} as const;

const singleHost = new ImmutableHost({ 'single-plugin': singlePlugin });
expectType<ImmutableEntityCollection<string, { value: string }>>(
  singleHost.entities.single
);

// Edge case: Deeply nested entity values
type NestedEntity = {
  level1: {
    level2: {
      level3: {
        data: string;
        meta: {
          timestamp: number;
          tags: string[];
        };
      };
    };
  };
};

type DeepPlugin = ImmutablePlugin<{
  deep: ImmutableEntities<string, NestedEntity>;
}>;

declare const deepPlugin: DeepPlugin;
declare const deepHost: ImmutableHost<DeepPlugin>;

const deepEntities = deepHost.entities.deep.get('test');
expectType<NestedEntity[]>(deepEntities);

if (deepEntities.length > 0) {
  const entity = deepEntities[0];
  expectType<string>(entity.level1.level2.level3.data);
  expectType<number>(entity.level1.level2.level3.meta.timestamp);
  expectType<string[]>(entity.level1.level2.level3.meta.tags);
}

// Edge case: Plugin with symbol entity types
const globalSymbol = Symbol.for('global');
const localSymbol = Symbol('local');

type SymbolOnlyPlugin = ImmutablePlugin<{
  symbolEntity: ImmutableEntities<symbol, string>;
}>;

declare const symbolOnlyPlugin: SymbolOnlyPlugin;
expectType<ImmutableEntities<symbol, string>>(
  symbolOnlyPlugin.entities.symbolEntity
);

// Edge case: Very long plugin URN
const veryLongUrn = 'a'.repeat(1000);
expectType<PluginURN>(veryLongUrn);

// Edge case: Special characters and unicode in URNs and keys
declare const specialUrn: string;
declare const unicodeUrn: string;
declare const nonEmptyKey: NonEmptyString<'key'>;

expectType<PluginURN>(specialUrn);
expectType<PluginURN>(unicodeUrn);
// ImmutableEntityKey accepts symbol keys
declare const symKey: symbol;
expectType<ImmutableEntityKey>(symKey);

// Edge case: Complex entity set where some collections may remain empty
type ComplexEntitiesPlugin = ImmutablePlugin<{
  required1: ImmutableEntities<string, string>;
  required2: ImmutableEntities<symbol, number>;
  optional1: ImmutableEntities<string, boolean>;
  optional2: ImmutableEntities<symbol, string>;
  optional3: ImmutableEntities<string | symbol, unknown>;
}>;

const minimalComplexPlugin: ComplexEntitiesPlugin = {
  name: 'minimal-complex',
  entities: {
    required1: { key: 'value' },
    required2: { [Symbol('key')]: 42 },
    optional1: {},
    optional2: {},
    optional3: {},
  },
} as const;

const maximalComplexPlugin: ComplexEntitiesPlugin = {
  name: 'maximal-complex',
  entities: {
    required1: { key: 'value' },
    required2: { [Symbol('key')]: 42 },
    optional1: { key: true },
    optional2: { [Symbol('key')]: 'value' },
    optional3: {
      stringKey: 'string-value',
      [Symbol('symbolKey')]: 123,
    },
  },
} as const;

expectType<ComplexEntitiesPlugin>(minimalComplexPlugin);
expectType<ComplexEntitiesPlugin>(maximalComplexPlugin);

// Edge case: Plugin with function entity values
type FunctionEntity = () => {
  compute: (x: number) => number;
  async: () => Promise<string>;
  generic: <T>(value: T) => T;
};

type FunctionPlugin = ImmutablePlugin<{
  functions: ImmutableEntities<string, FunctionEntity>;
}>;

declare const functionPlugin: FunctionPlugin;
declare const functionHost: ImmutableHost<FunctionPlugin>;

const functions = functionHost.entities.functions.get('test');
expectType<FunctionEntity[]>(functions);

if (functions.length > 0) {
  const fn = functions[0]();
  expectType<(x: number) => number>(fn.compute);
  expectType<() => Promise<string>>(fn.async);
  expectType<<T>(value: T) => T>(fn.generic);
}

// Edge case: Plugin with class instance entity values
class CustomEntity {
  constructor(public value: string) {}

  method(): string {
    return this.value.toUpperCase();
  }
}

type ClassPlugin = ImmutablePlugin<{
  classes: ImmutableEntities<string, CustomEntity>;
}>;

declare const classPlugin: ClassPlugin;
declare const classHost: ImmutableHost<ClassPlugin>;

const classes = classHost.entities.classes.get('test');
expectType<CustomEntity[]>(classes);

// Edge case: Plugin with union type entity values
type UnionEntity =
  | string
  | number
  | boolean
  | { type: 'object'; data: unknown };

type UnionPlugin = ImmutablePlugin<{
  unions: ImmutableEntities<string, UnionEntity>;
}>;

declare const unionPlugin: UnionPlugin;
declare const unionHost: ImmutableHost<UnionPlugin>;

const unions = unionHost.entities.unions.get('test');
expectType<UnionEntity[]>(unions);

// Edge case: Large numbers of entity types
type ManyEntityTypes = {
  type1: ImmutableEntities<string, string>;
  type2: ImmutableEntities<string, string>;
  type3: ImmutableEntities<string, string>;
  type4: ImmutableEntities<string, string>;
  type5: ImmutableEntities<string, string>;
  type6: ImmutableEntities<string, string>;
  type7: ImmutableEntities<string, string>;
  type8: ImmutableEntities<string, string>;
  type9: ImmutableEntities<string, string>;
  type10: ImmutableEntities<string, string>;
  type11: ImmutableEntities<string, string>;
  type12: ImmutableEntities<string, string>;
  type13: ImmutableEntities<string, string>;
  type14: ImmutableEntities<string, string>;
  type15: ImmutableEntities<string, string>;
  type16: ImmutableEntities<string, string>;
  type17: ImmutableEntities<string, string>;
  type18: ImmutableEntities<string, string>;
  type19: ImmutableEntities<string, string>;
  type20: ImmutableEntities<string, string>;
};

type ManyTypesPlugin = ImmutablePlugin<ManyEntityTypes>;
declare const manyTypesHost: ImmutableHost<ManyTypesPlugin>;

// Verify all entity types are accessible
expectType<ImmutableEntityCollection<string, string>>(
  manyTypesHost.entities.type1
);
expectType<ImmutableEntityCollection<string, string>>(
  manyTypesHost.entities.type10
);
expectType<ImmutableEntityCollection<string, string>>(
  manyTypesHost.entities.type20
);

// Edge case: Plugin with generic entity values
type GenericEntity<T> = {
  value: T;
  metadata: {
    type: string;
  };
};

type GenericStringEntity = GenericEntity<string>;
type GenericNumberEntity = GenericEntity<number>;

type GenericPlugin = ImmutablePlugin<{
  stringGenerics: ImmutableEntities<string, GenericStringEntity>;
  numberGenerics: ImmutableEntities<string, GenericNumberEntity>;
}>;

declare const genericHost: ImmutableHost<GenericPlugin>;

const stringGenerics = genericHost.entities.stringGenerics.get('test');
expectType<GenericStringEntity[]>(stringGenerics);

const numberGenerics = genericHost.entities.numberGenerics.get('test');
expectType<GenericNumberEntity[]>(numberGenerics);

// Edge case: Extremely complex entity key constraints
type WeirdKeyConstraints = ImmutablePlugin<{
  whitespaceKeys: ImmutableEntities<' ' | '\t' | '\n', string>;
  specialChars: ImmutableEntities<'!@#$%^&*()' | '<>?:{}[]', number>;
  unicodeKeys: ImmutableEntities<'🚀' | '🎯' | '💀', boolean>;
}>;

declare const weirdKeysHost: ImmutableHost<WeirdKeyConstraints>;

expectType<string[]>(weirdKeysHost.entities.whitespaceKeys.get(' '));
expectType<number[]>(weirdKeysHost.entities.specialChars.get('!@#$%^&*()'));
expectType<boolean[]>(weirdKeysHost.entities.unicodeKeys.get('🚀'));

// Edge case: Invalid constructions that should fail
expectError(() => {
  const invalidPlugin1: ImmutablePlugin = {
    name: 'missing-entities',
    // entities property missing
  };
  return invalidPlugin1;
});

expectError(() => {
  const invalidPlugin2: ImmutablePlugin = {
    // name property missing
    entities: {},
  };
  return invalidPlugin2;
});

// Edge case: Host with mismatched generic parameters
type MismatchedPlugin = ImmutablePlugin<{
  test: ImmutableEntities<string, string>;
}>;
declare const mismatchedPlugins: ImmutablePlugins<ImmutablePlugin>; // Different plugin type

// This should work because ImmutablePlugin is more general
expectType<ImmutableHost<ImmutablePlugin>>(
  new ImmutableHost(mismatchedPlugins)
);

// Edge case: Circular references in entity values (allowed by type system)
type CircularEntity = {
  name: string;
  reference?: CircularEntity;
  references: CircularEntity[];
};

type CircularPlugin = ImmutablePlugin<{
  circular: ImmutableEntities<string, CircularEntity>;
}>;

declare const circularHost: ImmutableHost<CircularPlugin>;
expectType<ImmutableEntityCollection<string, CircularEntity>>(
  circularHost.entities.circular
);

// Edge case: Intersection types in entity values
type BaseEntity = { id: string; name: string };
type ExtendedEntity = BaseEntity & { extended: boolean; version: number };

type IntersectionPlugin = ImmutablePlugin<{
  intersections: ImmutableEntities<string, ExtendedEntity>;
}>;

declare const intersectionHost: ImmutableHost<IntersectionPlugin>;
const intersectionEntities =
  intersectionHost.entities.intersections.get('test');
expectType<ExtendedEntity[]>(intersectionEntities);

if (intersectionEntities.length > 0) {
  const entity = intersectionEntities[0];
  expectType<string>(entity.id);
  expectType<string>(entity.name);
  expectType<boolean>(entity.extended);
  expectType<number>(entity.version);
}

// Edge case: Conditional types in entity values
type ConditionalEntity<T> = T extends string
  ? { stringValue: T; type: 'string' }
  : T extends number
    ? { numberValue: T; type: 'number' }
    : { unknownValue: T; type: 'unknown' };

type ConditionalPlugin = ImmutablePlugin<{
  conditionals: ImmutableEntities<
    string,
    ConditionalEntity<string> | ConditionalEntity<number>
  >;
}>;

declare const conditionalHost: ImmutableHost<ConditionalPlugin>;
const conditionalEntities = conditionalHost.entities.conditionals.get('test');
expectType<(ConditionalEntity<string> | ConditionalEntity<number>)[]>(
  conditionalEntities
);

// Edge case: Entity collections with zero entities
declare const emptyCollectionHost: ImmutableHost<
  ImmutablePlugin<{
    empty: ImmutableEntities<string, string>;
  }>
>;

const emptyResults = emptyCollectionHost.entities.empty.get('nonexistent');
expectType<string[]>(emptyResults); // Should be empty array []

const emptyFlat = emptyCollectionHost.entities.empty.flat();
expectType<[string, string, PluginURN][]>(emptyFlat); // Should be empty array []

const emptyMap = emptyCollectionHost.entities.empty.map(() => 'mapped');
expectType<string[]>(emptyMap); // Should be empty array []

const emptyFlatMap = emptyCollectionHost.entities.empty.flatMap(
  () => 'flatmapped'
);
expectType<string[]>(emptyFlatMap); // Should be empty array []

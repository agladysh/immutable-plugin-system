[immutable-plugin-system](../README.md) / ImmutableEntityCollection

# Class: ImmutableEntityCollection\<K, E\>

Defined in: [ImmutableEntityCollection.ts:28](https://github.com/agladysh/immutable-plugin-system/blob/main/src/ImmutableEntityCollection.ts#L28)

Implementation of immutable entity collections that provide convenient iteration methods.
Wraps Map\<K, E[]\> functionality with additional utility methods for working with entities.
Tracks which plugin each entity came from for proper attribution.

## Type Parameters

### K

`K` *extends* `string` \| `symbol`

The key type, must extend PropertyKey

### E

`E`

The entity type

## Constructors

### Constructor

> **new ImmutableEntityCollection**\<`K`, `E`\>(`pluginEntities`): `ImmutableEntityCollection`\<`K`, `E`\>

Defined in: [ImmutableEntityCollection.ts:39](https://github.com/agladysh/immutable-plugin-system/blob/main/src/ImmutableEntityCollection.ts#L39)

Creates a new ImmutableEntityCollection from plugin entities.

#### Parameters

##### pluginEntities

`Record`\<[`PluginURN`](../type-aliases/PluginURN.md), [`ImmutableEntities`](../type-aliases/ImmutableEntities.md)\<`K`, `E`\>\>

Record of plugin URN to entities for that plugin

#### Returns

`ImmutableEntityCollection`\<`K`, `E`\>

## Accessors

### size

#### Get Signature

> **get** **size**(): `number`

Defined in: [ImmutableEntityCollection.ts:72](https://github.com/agladysh/immutable-plugin-system/blob/main/src/ImmutableEntityCollection.ts#L72)

Returns the number of unique keys in the collection.

##### Returns

`number`

The count of unique keys

## Methods

### \[iterator\]()

> **\[iterator\]**(): `Iterator`\<\[`E`, `K`, `string`\]\>

Defined in: [ImmutableEntityCollection.ts:170](https://github.com/agladysh/immutable-plugin-system/blob/main/src/ImmutableEntityCollection.ts#L170)

Makes the collection iterable over individual entities with metadata.
Each iteration yields a tuple of [entity, key, pluginURN].

#### Returns

`Iterator`\<\[`E`, `K`, `string`\]\>

Iterator yielding [entity, key, pluginURN] tuples

***

### entries()

> **entries**(): `IterableIterator`\<\[`K`, `E`[]\]\>

Defined in: [ImmutableEntityCollection.ts:105](https://github.com/agladysh/immutable-plugin-system/blob/main/src/ImmutableEntityCollection.ts#L105)

Returns an iterator over all key-entity array pairs.

#### Returns

`IterableIterator`\<\[`K`, `E`[]\]\>

Iterator yielding [key, entities[]] tuples

***

### flat()

> **flat**(): \[`E`, `K`, `string`\][]

Defined in: [ImmutableEntityCollection.ts:121](https://github.com/agladysh/immutable-plugin-system/blob/main/src/ImmutableEntityCollection.ts#L121)

Flattens all entities into a single array with metadata.
Each entity is returned as a tuple with the entity, its key, and plugin URN.

#### Returns

\[`E`, `K`, `string`\][]

Array of [entity, key, pluginURN] tuples

***

### flatMap()

> **flatMap**\<`U`\>(`fn`): `U`[]

Defined in: [ImmutableEntityCollection.ts:154](https://github.com/agladysh/immutable-plugin-system/blob/main/src/ImmutableEntityCollection.ts#L154)

Flat maps over individual entities, applying the transform function to each entity.

#### Type Parameters

##### U

`U`

The return type of the mapping function

#### Parameters

##### fn

(`entity`, `key`, `plugin`) => `U`

Function that transforms an entity, key, and plugin URN into type U

#### Returns

`U`[]

Array of transformed values

***

### get()

> **get**(`key`): `E`[]

Defined in: [ImmutableEntityCollection.ts:62](https://github.com/agladysh/immutable-plugin-system/blob/main/src/ImmutableEntityCollection.ts#L62)

Retrieves all entities associated with the given key.

#### Parameters

##### key

`K`

The key to look up

#### Returns

`E`[]

Array of entities for the key, empty array if key not found

***

### keys()

> **keys**(): `IterableIterator`\<`K`\>

Defined in: [ImmutableEntityCollection.ts:81](https://github.com/agladysh/immutable-plugin-system/blob/main/src/ImmutableEntityCollection.ts#L81)

Returns an iterator over the unique keys in the collection.

#### Returns

`IterableIterator`\<`K`\>

Iterator yielding unique keys in insertion order

***

### map()

> **map**\<`U`\>(`fn`): `U`[]

Defined in: [ImmutableEntityCollection.ts:138](https://github.com/agladysh/immutable-plugin-system/blob/main/src/ImmutableEntityCollection.ts#L138)

Maps over entity arrays by key, applying the transform function to each group.

#### Type Parameters

##### U

`U`

The return type of the mapping function

#### Parameters

##### fn

(`entities`, `key`) => `U`

Function that transforms an entity array and key into type U

#### Returns

`U`[]

Array of transformed values

***

### values()

> **values**(): `IterableIterator`\<`E`[]\>

Defined in: [ImmutableEntityCollection.ts:90](https://github.com/agladysh/immutable-plugin-system/blob/main/src/ImmutableEntityCollection.ts#L90)

Returns an iterator over the entity arrays for each key in the collection.

#### Returns

`IterableIterator`\<`E`[]\>

Iterator yielding entity arrays in insertion order

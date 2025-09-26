# ADR: Add Map-like Methods (.size, .keys, .values) to ImmutableEntityCollection

## Status

Proposed

## Context

The `ImmutableEntityCollection<K, E>` class provides Map-like functionality but
lacks several properties and methods that would complete Map API compatibility.
The class wraps `Map<K, EntityWithPlugin<E>[]>` internally and exposes methods
like `get()`, `entries()`, but is missing `.size`, `.keys()`, and `.values()`.

Users need these for various use cases:

- Checking collection size and emptiness (`.size`)
- Iterating over keys or values independently (`.keys()`, `.values()`)
- Reporting collection statistics
- Implementing pagination or limits
- Debugging and logging
- Full Map-like API compatibility for familiar usage patterns

The specification describes the class as "Wraps Map<K, E[]> functionality with
additional utility methods", suggesting Map API completeness is desirable.

## Decision

Add `.size`, `.keys()`, and `.values()` methods to
`ImmutableEntityCollection<K, E>` to provide full Map-like API compatibility.

### Implementation Details

- `.size`: Read-only getter returning `this.storage.size` (O(1))
- `.keys()`: Returns an iterator over unique keys (delegates to
  `this.storage.keys()`)
- `.values()`: Returns an iterator over arrays of entities per key (similar to
  `entries()` but values-only)

All additions maintain immutability and follow existing patterns.

### API Additions

```typescript
export class ImmutableEntityCollection<K extends string | symbol, E> {
  // ... existing methods

  /**
   * Returns the number of unique keys in the collection.
   */
  get size(): number {
    return this.storage.size;
  }

  /**
   * Returns an iterator over the unique keys in the collection.
   */
  keys(): IterableIterator<K> {
    return this.storage.keys();
  }

  /**
   * Returns an iterator over the entity arrays for each key in the collection.
   */
  values(): IterableIterator<E[]> {
    const storage = this.storage;
    function* gen(): IterableIterator<E[]> {
      for (const [, list] of storage.entries()) {
        yield list.map((item) => item.entity);
      }
    }
    return gen();
  }
}
```

## Consequences

### Positive

- Completes Map-like API compatibility
- Enables efficient emptiness checks (`collection.size === 0`)
- Provides expected methods for iteration and statistics
- Zero performance cost for `.size` and `.keys()` (direct delegation)
- Maintains immutability (read-only operations)
- Familiar API for developers used to Map/ Set

### Negative

- Adds three more members to the API surface
- Slight increase in bundle size (minimal)
- Potential confusion with array `.length` (but this is a collection, not an
  array)

### Neutral

- No breaking changes to existing code
- Follows TypeScript getter and method patterns used elsewhere in the codebase

## Alternatives Considered

### 1. Use `.length` instead of `.size`

- **Rationale**: Arrays use `.length`, collections might expect it
- **Rejected**: Map uses `.size`, and this class wraps Map functionality.
  Consistency with Map API takes precedence.

### 2. No additional methods

- **Rationale**: Current API is sufficient
- **Rejected**: Violates principle of complete Map API wrapping as stated in
  spec.

### 3. Add both `.size` and `.length`

- **Rationale**: Maximum compatibility
- **Rejected**: Unnecessary API duplication, potential confusion.

### 4. Make `.size` a method instead of property

- **Rationale**: Consistency with existing methods
- **Rejected**: Map uses property, and property is more idiomatic for size in JS
  collections.

### 5. Implement `.values()` differently

- **Rationale**: Could return flattened entities instead of grouped arrays
- **Rejected**: Consistency with Map API (Map.values() returns values, not
  entries). Grouped arrays match the collection's structure.

## Testing

Ensure all new methods achieve 100% test coverage using tap. Add tests to
`test/collection.test.ts` and type tests to `test-d/types.test-d.ts`.

### Unit Tests (`test/collection.test.ts`)

- **`.size` property**:
  - Empty collection returns 0
  - Populated collection returns correct count of unique keys
  - Size reflects keys with entities (ignores empty arrays if any)
  - Immutable: size doesn't change after construction
- **`.keys()` method**:
  - Returns iterator over unique keys in insertion order
  - Empty collection yields no keys
  - Iteration order matches `entries()` keys
  - Immutable: keys iterator doesn't expose internal mutations
- **`.values()` method**:
  - Returns iterator over entity arrays per key in insertion order
  - Each yielded value is a fresh array copy (immutability)
  - Empty collection yields no values
  - Values match `entries()` values
  - Immutable: yielded arrays are read-only snapshots

### Integration Tests

- Verify `.keys()` and `.values()` iterators align with `.entries()` (same
  order, no extras)
- Test immutability: attempts to modify yielded arrays/values throw or are
  ignored
- Regression: ensure new methods don't break existing `get()`, `entries()`,
  `flat()`, etc.

### Type Tests (`test-d/types.test-d.ts`)

- `.size` is readonly number, assignable to number
- `.keys()` returns `IterableIterator<K>`, compatible with for-of loops
- `.values()` returns `IterableIterator<E[]>`, with E[] being non-nullable
- Type safety: K constrained to string | symbol, E to non-nullable types
- Integration types: methods work with `ImmutableEntityCollectionsFromPlugin`

Run `pnpm -s test` to validate all tests pass and coverage is 100%.

## Documentation Update Plan

After implementation:

1. **Update Specification Document (`docs/spec.md`)**:
   - Add `.size`, `.keys()`, `.values()` to the `ImmutableEntityCollection`
     interface definition.
   - Update spec version from 1.1.0 to 1.2.0.
   - Update document revision history.

2. **Update README.md**:
   - Add `.size`, `.keys()`, `.values()` to the "Collections API" section.

3. **Regenerate API Documentation (`docs/api/`)**:
   - Run `pnpm -s build` to regenerate TypeDoc docs, which will auto-include the
     new methods.

4. **Update CHANGELOG.md**:
   - Document the new methods under version 1.2.0.

5. **Review Examples**:
   - Check `examples/events/` for potential usage demonstrations.

## Specification Version

This ADR applies to Specification 1.1.0 and will bump the version to 1.2.0 upon
implementation.

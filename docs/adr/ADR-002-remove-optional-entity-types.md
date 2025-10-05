# ADR: Remove Optional Entity Type Support

## Status

Proposed

## Context

The current specification (docs/spec.md:114) allows plugins to omit entity types
that are declared optional in the integration's concrete entities type. The host
implementation mirrors this: `ImmutableEntityCollections` preserves optional
modifiers (`src/ImmutableHost.ts:34`), and `ImmutableHost` only materializes
collections for entity types encountered at runtime
(`src/ImmutableHost.ts:105`). Runtime guards (`src/guards/plugin.ts:25`) only
enforce presence when `requiredEntityTypes` is provided by the integration,
leaving optional types unchecked by default.

This behaviour leaks into consumer ergonomics:

- `host.entities` exposes optional properties, forcing downstream checks and
  type refinements even when integrators intend to treat "optional" as "may be
  empty" rather than "may be missing".
- Each plugin can shape `entities` differently at runtime, so collections cannot
  be relied upon for discovery without defensive code.
- Optional entity omission is indistinguishable from a misconfigured plugin,
  requiring extra tooling or runtime validation for integrations to stay safe.

Integrators report that always receiving a collection (possibly empty) is vastly
more predictable. They are willing to pay the small cost of providing empty
entity maps in plugins if it yields a deterministic host API.

## Decision

Treat every declared entity type as required. Plugins MUST define all entity
types in the integration's schema, supplying empty immutable maps when they have
no entities to contribute. The host exposes each entity collection as a required
property and treats omissions as errors.

As part of this change, the `requiredEntityTypes` option is removed. Runtime
validation uniformly enforces presence for every entity type, and integrations
are expected to handle empty collections according to their domain logic without
library-provided helpers.

### Key Points

- Update the specification to state that plugins MUST define all declared entity
  types, even when no entities are contributed.
- Remove optional modifiers from `ImmutableEntityCollections`, making
  `host.entities` a record of required properties.
- Remove the `requiredEntityTypes` option from `ImmutableHost` and guard APIs;
  the host always enforces completeness.
- Enhance runtime validation so missing entity types throw a `TypeError` naming
  the offending plugin and entity type.

## Consequences

### Positive

- Consumers can interact with `host.entities` without defensive optional checks;
  every collection is always present.
- Entity discovery becomes deterministic: every declared entity type always
  yields a collection (empty or populated).
- The API surface simplifies by eliminating special cases around optional types
  and the `requiredEntityTypes` configuration path.
- Documentation aligns with the stronger guarantee, reducing ambiguity for
  plugin authors.

### Negative

- Breaking change for plugins that presently omit optional entity types; they
  must emit empty maps instead.
- Integrations relying on `requiredEntityTypes` for bespoke error messaging must
  build that logic externally (e.g., wrapper validation).
- Optional-supporting tests and documentation need removal or rewriting, and
  tooling that referenced `requiredEntityTypes` must be updated.

### Neutral / Migration

- Provide a migration guide: (1) update entity schema types to require all keys,
  (2) initialize plugins with empty maps for previously optional types, (3) drop
  usage of `requiredEntityTypes` and replace with integration-level validation
  if desired.
- Inline empty object literals remain the recommended way to represent "no
  entities"; no new helper function is introduced.
- The host keeps relying on integration discipline for immutability; plugins can
  freeze their own maps if needed.
- Failing fast at compile time (once optional types are removed) and runtime is
  deemed sufficient—no additional lint or codemod tooling is planned for the
  migration.

## Alternatives Considered

1. **Schema-driven optional synthesis** – Require integrations to register an
   entity schema so the host can synthesize empty collections for missing
   optional types. Rejected: increased API surface, additional configuration,
   and still permits omission at runtime, complicating invariants.

2. **Accessor-based fallback (`host.getEntityCollection(type)`)** – Keep
   optional properties but offer an accessor that always returns a collection.
   Rejected: dual pathways confuse consumers and perpetuate optional semantics.

3. **Status quo with better tooling** – Retain optional types but improve
   diagnostics (lint rules, dev-time warnings). Rejected: does not eliminate the
   underlying ergonomics problem; consumers still need defensive checks.

## Implementation Sketch

1. **Specification** – Update `docs/spec.md` (Entity Type Optionality section)
   to remove optional allowances and clarify the new contract. Bump spec version
   to the next minor and document the removal of `requiredEntityTypes`.
2. **Types** – Adjust `ImmutableEntityCollections` and related helpers to remove
   optional modifiers; ensure `ImmutablePlugin<C>` rejects schemas with optional
   properties (e.g., via mapped-type constraint).
3. **Runtime** – Update `ImmutableHost`, `isImmutablePlugin`,
   `assertImmutablePlugin`, and `assertImmutablePlugins` to fail when any entity
   type is missing; remove handling of `requiredEntityTypes`.
4. **API Surface** – Delete the `requiredEntityTypes` options from public APIs
   and regenerate docs. Provide clear error messages pointing to the new
   contract.
5. **Tests** – Remove optional-entity fixtures (`OptionalEntities` scenarios in
   `test-d/host.test-d.ts`, `test-d/constraints.test-d.ts`, etc.), add
   regression tests that assert omissions throw, and update readme/spec tests.
6. **Docs & Narrative** – Rewrite the relevant sections of the specification and
   README to emphasise deterministic entity discovery, document the "empty map"
   convention, remove obsolete optional-language, and call out the behavioural
   shift in release notes, migration guides, and API reference prose.

## Timeline

Targeting the next pre-1.0 minor release. Implementation can proceed in a single
breaking-change PR once the ADR is accepted.

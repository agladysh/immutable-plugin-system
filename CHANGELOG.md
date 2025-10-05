# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.0] - 2025-10-05

### Changed

- Removed optional top-level entity support; plugins must now provide every
  declared entity type and use empty maps to signal "no entities"
- Dropped the `requiredEntityTypes` runtime escape hatch; `ImmutableHost` and
  guard APIs enforce entity completeness unconditionally
- Strengthened runtime validation so the host throws when a plugin omits any
  declared entity type
- Updated documentation and examples to reflect deterministic entity discovery

### Fixed

- Prevented plugins with mismatched entity schemas from silently producing
  partial collections by failing fast during host construction

Implements Specification v1.3.0 (r1.3.0)

## [0.2.0] - 2025-09-26

### Added

- `ImmutableEntityCollection.size` property: Returns the number of unique keys
  in the collection
- `ImmutableEntityCollection.keys()` method: Returns an iterator over unique
  keys
- `ImmutableEntityCollection.values()` method: Returns an iterator over entity
  arrays per key
- Full Map-like API compatibility for `ImmutableEntityCollection`

Implements Specification v1.2.0 (r1.2.0)

## [0.1.1] - 2025-01-25

### Added

- Repository, bugs, homepage, and funding fields to package.json for better npm
  integration
- `sideEffects: false` to package.json to enable tree-shaking optimization
- Documentation files (README.md, LICENSE, docs/) included in npm package

### Changed

- Updated pnpm from 10.15.1 to 10.17.1 across package.json and CI workflows
- Improved `prepublishOnly` script to clean before building for reliable package
  creation

## [0.1.0] - 2025-01-25

### Added

- Initial release of immutable-plugin-system
- Minimalist strongly typed immutable plugin system for Node.js ≥22
- `ImmutablePlugin<C>` interface for plugin entities
- `ImmutableHost<P>` for centralized plugin and entity management
- `ImmutableEntityCollection` with convenient iteration methods
- Comprehensive TypeScript type definitions and guards
- Zero runtime dependencies
- Complete test coverage with tap and tsd
- Generated API documentation with TypeDoc
- Examples and detailed specification

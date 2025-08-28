# TODO

- [x] Finish [spec](docs/spec.md)
- [x] Rigorously review the [spec](docs/spec.md)
- [x] Bump the [spec](docs/spec.md) to v1.0.0, r1.0.0
- [x] Add pre-made code infrastructure files, and GH funding
- [x] Add minimal stubs for code and tests
- [x] Configure [package.json](package.json)
- [x] Run lint and tests
- [x] Squash to initial commit
- [ ] Document explicitly (v1.1.0/r1.1.1) and test that plugins are allowed to
      omit any or all entity types (the `entities` key remains mandatory, its
      fields may be declared as optional in the concrete `Entities` type).
      Add a test that checks if plugin does not provide a required type,
      it is not a valid plugin (works at runtime only if more than one plugin
      is provided, of course).
- [ ] Amend spec (v1.1.0/r1.1.2) to require rigorous `tsd` tests. Implement said tests.
- [ ] Rename implementation files (and their tests) so they match what they
      export (e.g. `ImmutableEntityCollection.ts`)
- [ ] Implement code, example and tests, all with rigorous inline documentation
- [ ] Run `~/.cargo/bin/similarity-ts` and fix reports
- [ ] Rigorously review the implementation
- [ ] Generate documentation
- [ ] Write [README.md](README.md)
- [ ] Write [examples/README.md](examples/README.md)
- [ ] Setup GH pages with hook on tag push
- [ ] Setup GH npm publish hook on tag push
- [ ] Setup GH release on tag push
- [ ] Prepare release 1.0.0-rc1 with proper [CHANGELOG.md](CHANGELOG.md)
- [ ] Tag v1.0.0-rc1 with -m from [CHANGELOG.md](CHANGELOG.md) entry

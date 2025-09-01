/**
 * MINIMAL REGRESSION TEST: Exclude empty strings from string type constraint
 */

import { expectError, expectNotType } from 'tsd';

// Parameter type string is declared too wide for argument type ""
// expectType<Exclude<string, ''>>('')

expectNotType<Exclude<string, ''>>(''); // Not sure if this means anything

// However, this is possible:
type NonEmptyString<S extends string = string> = '' extends S ? never : S;

expectError<NonEmptyString>('');

// Argument of type string is not assignable to parameter of type never.
// expectType<NonEmptyString>('');

type MyPropertyKey = Exclude<PropertyKey, string | number> | NonEmptyString;

expectError<MyPropertyKey>('');

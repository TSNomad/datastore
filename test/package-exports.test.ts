/**
 * The public entry point, imported by package name. Runs now.
 */

import { expect, test } from 'vitest';
import * as datastore from '@tsnomad/datastore';

test('exports only the exceptions at run time, since the rest are interfaces', () => {
  expect(Object.keys(datastore).sort()).toEqual(['DatastoreErrorException', 'DuplicateEntryException', 'RecordNotFoundException']);
});

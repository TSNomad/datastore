/**
 * Acceptance tests for the datastore exceptions.
 */

import { describe, expect, test } from 'vitest';
import { DatastoreErrorException, DuplicateEntryException, RecordNotFoundException } from '@tsnomad/datastore';

describe('datastore exceptions', () => {
  test('each carries its message, its cause and its own class name', () => {
    const cause = new Error('driver said no');
    for (const Kind of [DatastoreErrorException, DuplicateEntryException, RecordNotFoundException]) {
      const error = new Kind('Could not find a record where id equals 4', { cause });
      expect(error.message, Kind.name).toBe('Could not find a record where id equals 4');
      expect(error.cause, Kind.name).toBe(cause);
      expect(error.name, Kind.name).toBe(Kind.name);
    }
  });

  test('the two specific exceptions are DatastoreErrorExceptions, and not each other', () => {
    const duplicate = new DuplicateEntryException('d');
    const missing = new RecordNotFoundException('m');

    expect(duplicate).toBeInstanceOf(DatastoreErrorException);
    expect(missing).toBeInstanceOf(DatastoreErrorException);
    expect(missing).toBeInstanceOf(Error);
    expect(duplicate).not.toBeInstanceOf(RecordNotFoundException);
    expect(missing).not.toBeInstanceOf(DuplicateEntryException);
  });

  test('has no cause when none is given', () => {
    expect('cause' in new DatastoreErrorException('m')).toBe(false);
    expect('cause' in new RecordNotFoundException('m')).toBe(false);
  });
});

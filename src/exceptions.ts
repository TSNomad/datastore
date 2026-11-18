/**
 * Datastore exceptions
 *
 * PHPNomad's `DatastoreErrorException`, and its two subclasses
 * `DuplicateEntryException` and `RecordNotFoundException`. Each takes a
 * message and an optional `cause`, and its `name` is its class name.
 */

/** The store failed, or the base of a more specific datastore error. */
export class DatastoreErrorException extends Error {
  constructor(message: string, options: { cause?: unknown } = {}) {
    // Pass a cause only when the caller gave one, so `'cause' in error`
    // stays false otherwise, as for a plain Error.
    super(message, 'cause' in options ? { cause: options.cause } : {});
    this.name = new.target.name;
  }
}

/** A unique field or identity is already taken. */
export class DuplicateEntryException extends DatastoreErrorException {}

/** No record matches. */
export class RecordNotFoundException extends DatastoreErrorException {}

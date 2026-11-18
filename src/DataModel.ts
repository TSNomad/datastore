/**
 * DataModel and CanIdentify
 *
 * PHPNomad's `DataModel` and `CanIdentify`: a record a datastore reads and
 * writes, which can name its own identity.
 *
 * Where this differs from PHPNomad: an identity value may be a string as
 * well as a number. PHP's docblock says integers, and its
 * `WithSingleStringIdentity` trait already stores strings.
 */

/** Identity field name to value, such as `{ id: 12 }`. */
export type Identity = Record<string, number | string>;

export interface CanIdentify {
  /** The fields that identify this record. */
  getIdentity(): Identity;
}

export interface DataModel extends CanIdentify {}

/**
 * The datastore interfaces
 *
 * PHPNomad's `Datastore`, `DatastoreHasPrimaryKey`, `DatastoreHasWhere`
 * and `DatastoreHasCounts`. A store for one model implements the ones it
 * supports, and the application defines a narrower interface per model
 * that extends them, with its own token.
 *
 * Where this differs from PHPNomad: every method returns a promise, since
 * a Node datastore reads over I/O. There are no container tokens here,
 * because many stores implement each interface, and one token would reach
 * only one of them, as with @tsnomad/registry's interfaces.
 */

import type { DataModel, Identity } from './DataModel.js';

export type Attributes = Record<string, unknown>;

export type SortOrder = 'ASC' | 'DESC';

/** One condition: a column, an operator such as '=', 'IN' or 'LIKE', and a value. */
export interface WhereClause {
  column: string;
  operator: string;
  value: unknown;
}

/**
 * A group of clauses. `type` joins the clauses inside the group, and
 * `groupType` joins this group to the one before it. Both default to AND.
 */
export interface WhereGroup {
  type?: 'AND' | 'OR';
  groupType?: 'AND' | 'OR';
  clauses: WhereClause[];
}

export interface Datastore<T extends DataModel = DataModel> {
  /**
   * Inserts a record and answers its model.
   *
   * @throws DuplicateEntryException when a unique field or identity is taken
   * @throws DatastoreErrorException when the store fails
   */
  create(attributes: Attributes): Promise<T>;

  /**
   * Updates the record with this compound identity.
   *
   * @throws RecordNotFoundException when no record has it
   * @throws DatastoreErrorException when the store fails
   */
  updateCompound(ids: Identity, attributes: Attributes): Promise<void>;
}

export interface DatastoreHasPrimaryKey<T extends DataModel = DataModel> {
  /**
   * @throws RecordNotFoundException when no record has this key
   * @throws DatastoreErrorException when the store fails
   */
  find(id: number | string): Promise<T>;

  /**
   * The records with these keys. A key with no record is left out.
   *
   * @throws DatastoreErrorException when the store fails
   */
  findMultiple(ids: readonly (number | string)[]): Promise<T[]>;

  /**
   * @throws RecordNotFoundException when no record has this key
   * @throws DuplicateEntryException when the change takes a unique value
   * @throws DatastoreErrorException when the store fails
   */
  update(id: number | string, attributes: Attributes): Promise<void>;

  /**
   * @throws RecordNotFoundException when no record has this key
   * @throws DatastoreErrorException when the store fails
   */
  delete(id: number | string): Promise<void>;
}

export interface DatastoreHasWhere<T extends DataModel = DataModel> {
  /**
   * The records matching the groups. An empty result is an empty list.
   *
   * @throws DatastoreErrorException when a clause names a column the model
   *   does not have or an operator the store does not support, before it
   *   reads anything, and when the store fails
   */
  where(conditions: WhereGroup[], limit?: number | null, offset?: number | null, orderBy?: string | null, order?: SortOrder): Promise<T[]>;

  /** As `where`, with one AND group. */
  andWhere(clauses: WhereClause[], limit?: number | null, offset?: number | null, orderBy?: string | null, order?: SortOrder): Promise<T[]>;

  /** As `where`, with one OR group. */
  orWhere(clauses: WhereClause[], limit?: number | null, offset?: number | null, orderBy?: string | null, order?: SortOrder): Promise<T[]>;

  /**
   * Deletes every record matching the clauses, joined by AND, as PHPNomad's
   * table datastore reads them.
   *
   * @throws DatastoreErrorException when `clauses` is empty, since that
   *   would delete every record, and for an unknown column or operator as
   *   `where` does, in each case before it deletes anything, and when the
   *   store fails
   */
  deleteWhere(clauses: WhereClause[]): Promise<void>;

  /**
   * The first record whose `field` equals `value`.
   *
   * @throws RecordNotFoundException when none matches
   * @throws DatastoreErrorException when the store fails
   */
  findBy(field: string, value: unknown): Promise<T>;
}

export interface DatastoreHasCounts {
  /**
   * A close estimate of the record count, not an exact one.
   *
   * @throws DatastoreErrorException when the store fails
   */
  getEstimatedCount(): Promise<number>;

  /**
   * How many records match the groups, read as `where` reads them.
   *
   * Where this differs from PHPNomad: PHP's docblock gives a list of
   * clauses joined by AND. This takes groups, as `where` does.
   *
   * @throws DatastoreErrorException as `where` does
   */
  countWhere(conditions: WhereGroup[]): Promise<number>;
  countAndWhere(clauses: WhereClause[]): Promise<number>;
  countOrWhere(clauses: WhereClause[]): Promise<number>;
}

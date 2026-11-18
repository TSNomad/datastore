/**
 * @tsnomad/datastore
 *
 * Public entry point. The datastore, model and adapter interfaces, the
 * where-clause shapes, and the datastore exceptions. This package holds
 * no store. Each platform supplies its own.
 */

export type { Identity, CanIdentify, DataModel } from './DataModel.js';
export type { ModelRecord, CanConvertModelToArray, ModelAdapter } from './ModelAdapter.js';
export type {
  Attributes,
  SortOrder,
  WhereClause,
  WhereGroup,
  Datastore,
  DatastoreHasPrimaryKey,
  DatastoreHasWhere,
  DatastoreHasCounts,
} from './Datastore.js';
export { DatastoreErrorException, DuplicateEntryException, RecordNotFoundException } from './exceptions.js';

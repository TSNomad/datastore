/**
 * ModelAdapter and CanConvertModelToArray
 *
 * PHPNomad's `ModelAdapter` and `CanConvertModelToArray`: convert between
 * a model and the plain record a datastore stores. An adapter is
 * stateless.
 */

import type { DataModel } from './DataModel.js';

export type ModelRecord = Record<string, unknown>;

export interface CanConvertModelToArray<TModel extends DataModel = DataModel> {
  toArray(model: TModel): ModelRecord;
}

export interface ModelAdapter<TModel extends DataModel = DataModel> extends CanConvertModelToArray<TModel> {
  toModel(record: ModelRecord): TModel;
}

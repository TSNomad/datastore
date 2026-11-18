/**
 * Compile-only checks, run by `npm run typecheck`. Each @ts-expect-error
 * line must stay an error. Nothing here runs.
 *
 * An in-memory store for one model implements every interface, as a
 * platform's store would, and the wrong shapes are refused.
 */

import type {
  Attributes,
  DataModel,
  Datastore,
  DatastoreHasCounts,
  DatastoreHasPrimaryKey,
  DatastoreHasWhere,
  Identity,
  ModelAdapter,
  ModelRecord,
  WhereClause,
  WhereGroup,
} from '@tsnomad/datastore';

class Order implements DataModel {
  constructor(readonly id: number, readonly total: number) {}
  getIdentity(): Identity {
    return { id: this.id };
  }
}

class OrderAdapter implements ModelAdapter<Order> {
  toModel(record: ModelRecord): Order {
    return new Order(Number(record.id), Number(record.total));
  }
  toArray(model: Order): ModelRecord {
    return { id: model.id, total: model.total };
  }
}

interface OrderDatastore extends Datastore<Order>, DatastoreHasPrimaryKey<Order>, DatastoreHasWhere<Order>, DatastoreHasCounts {}

declare const orders: OrderDatastore;

async function reads(): Promise<void> {
  const one: Order = await orders.find(1);
  const some: Order[] = await orders.andWhere([{ column: 'total', operator: '>', value: 10 }], 20, 0, 'id', 'DESC');
  const groups: WhereGroup[] = [{ type: 'OR', clauses: [{ column: 'id', operator: 'IN', value: [1, 2] }] }, { groupType: 'AND', clauses: [] }];
  const grouped: Order[] = await orders.where(groups);
  const counted: number = await orders.countAndWhere([]);
  const created: Order = await orders.create({ total: 5 } satisfies Attributes);
  await orders.updateCompound({ id: 1, store: 'a' }, { total: 6 });
  await orders.deleteWhere([{ column: 'total', operator: '=', value: 0 }]);
  void [one, some, grouped, counted, created];

  // @ts-expect-error find answers a promise, not the model
  const notAwaited: Order = orders.find(1);

  // @ts-expect-error a clause needs an operator
  const noOperator: WhereClause = { column: 'id', value: 1 };

  // @ts-expect-error order is ASC or DESC
  await orders.andWhere([], null, null, 'id', 'UP');

  // @ts-expect-error a group joins with AND or OR
  const badGroup: WhereGroup = { type: 'XOR', clauses: [] };

  void [notAwaited, noOperator, badGroup];
}

// @ts-expect-error a model must name its identity
const noIdentity: DataModel = { id: 1 };

// @ts-expect-error an identity value is a number or a string
const badIdentity: Identity = { id: true };

// @ts-expect-error an adapter needs toArray as well as toModel
const halfAdapter: ModelAdapter<Order> = { toModel: (record: ModelRecord) => new Order(1, 1) };

void [reads, OrderAdapter, noIdentity, badIdentity, halfAdapter];

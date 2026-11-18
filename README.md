# @tsnomad/datastore

The data access contracts: `DataModel`, `ModelAdapter`, `Datastore` and
its optional parts (`DatastoreHasPrimaryKey`, `DatastoreHasWhere`,
`DatastoreHasCounts`), the where clause shapes, and three exceptions. It
holds interfaces and exceptions only. A storage package implements them.

This is the TypeScript counterpart to PHPNomad's
[datastore](https://github.com/phpnomad/datastore) package.

## Install

```bash
npm install @tsnomad/datastore
```

The package ships compiled JavaScript with its type declarations, so
it needs no build step of its own. It needs Node 20.19 or later.

`scripts/consumer-check.sh [<commit>]` installs the package from git at
one commit into a scratch project and imports every export, from Node
and from TypeScript.

## Where it fits

The datastore contracts depend on no other package. A storage
integration implements them, and code that reads and writes records
names only these interfaces.

## Use

```ts
import type { DataModel, Datastore, DatastoreHasWhere, Identity } from '@tsnomad/datastore';
import { RecordNotFoundException } from '@tsnomad/datastore';

class Order implements DataModel {
  constructor(readonly id: number, readonly total: number) {}
  getIdentity(): Identity { return { id: this.id }; }
}

interface OrderStore extends Datastore<Order>, DatastoreHasWhere<Order> {}

const large = await orders.andWhere([{ column: 'total', operator: '>', value: 100 }], 20, 0, 'id', 'DESC');
```

## Where this differs from PHPNomad

- Every method returns a promise.
- The interfaces have no container tokens, since an application binds
  one store per model and a single token would reach only one of them.
- `deleteWhere` takes clauses joined by AND, and throws
  `DatastoreErrorException` for an empty list. PHPNomad's table
  datastore runs the empty query and deletes every record.
- `countWhere` takes a list of groups, as `where` does. PHP's docblock
  gives it a list of clauses joined by AND.
- An identity value may be a string as well as a number. PHP's docblock
  says integers, and its `WithSingleStringIdentity` trait already stores
  strings.
- Not ported yet: the datastore events (`RecordCreated` and the rest),
  the decorator and facade traits, the `Junction*` contracts, the
  `HasSingle*Identity` helpers, and `IdentityToWhere`.

## Extracted 2026-11-17

This package moved into its own repository on 2026-11-17, at version
0.1.0, with its tests.

## License

Copyright (C) 2026 TSNomad.

This package is free software, released under the GNU General Public
License, version 3 or any later version (GPL-3.0-or-later). It comes
with no warranty. The full text is in [LICENSE](LICENSE).

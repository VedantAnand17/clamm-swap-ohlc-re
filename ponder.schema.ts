import { onchainTable, index } from "ponder";
 
export const oneMinuteBuckets = onchainTable(
  "one_minute_buckets",
  (t) => ({
    pool: t.hex().notNull(),
    id: t.integer().primaryKey(),
    open: t.real().notNull(),
    close: t.real().notNull(),
    low: t.real().notNull(),
    high: t.real().notNull(),
    average: t.real().notNull(),
    count: t.integer().notNull(),
  }),
  (table) => ({
    poolTimeIdx: index().on(table.pool, table.id),
  })
);

export const fiveMinuteBuckets = onchainTable(
  "five_minute_buckets",
  (t) => ({
    pool: t.hex().notNull(),
    id: t.integer().primaryKey(),
    open: t.real().notNull(),
    close: t.real().notNull(),
    low: t.real().notNull(),
    high: t.real().notNull(),
    average: t.real().notNull(),
    count: t.integer().notNull(),
  }),
  (table) => ({
    poolTimeIdx: index().on(table.pool, table.id),
  })
);

export const fifteenMinuteBuckets = onchainTable(
  "fifteen_minute_buckets",
  (t) => ({
    pool: t.hex().notNull(),
    id: t.integer().primaryKey(),
    open: t.real().notNull(),
    close: t.real().notNull(),
    low: t.real().notNull(),
    high: t.real().notNull(),
    average: t.real().notNull(),
    count: t.integer().notNull(),
  }),
  (table) => ({
    poolTimeIdx: index().on(table.pool, table.id),
  })
);

export const hourBuckets = onchainTable(
  "hour_buckets",
  (t) => ({
    pool: t.hex().notNull(),
    id: t.integer().primaryKey(),
    open: t.real().notNull(),
    close: t.real().notNull(),
    low: t.real().notNull(),
    high: t.real().notNull(),
    average: t.real().notNull(),
    count: t.integer().notNull(),
  }),
  (table) => ({
    poolTimeIdx: index().on(table.pool, table.id),
  })
);

export const fourHourBuckets = onchainTable(
  "four_hour_buckets",
  (t) => ({
    pool: t.hex().notNull(),
    id: t.integer().primaryKey(),
    open: t.real().notNull(),
    close: t.real().notNull(),
    low: t.real().notNull(),
    high: t.real().notNull(),
    average: t.real().notNull(),
    count: t.integer().notNull(),
  }),
  (table) => ({
    poolTimeIdx: index().on(table.pool, table.id),
  })
);

export const dayBuckets = onchainTable(
  "day_buckets",
  (t) => ({
    pool: t.hex().notNull(),
    id: t.integer().primaryKey(),
    open: t.real().notNull(),
    close: t.real().notNull(),
    low: t.real().notNull(),
    high: t.real().notNull(),
    average: t.real().notNull(),
    count: t.integer().notNull(),
  }),
  (table) => ({
    poolTimeIdx: index().on(table.pool, table.id),
  })
);

import { onchainTable } from "ponder";
 
export const oneMinuteBuckets = onchainTable("one_minute_buckets", (t) => ({
  pool: t.hex().notNull(),
  id: t.integer().primaryKey(),
  open: t.real().notNull(),
  close: t.real().notNull(),
  low: t.real().notNull(),
  high: t.real().notNull(),
  average: t.real().notNull(),
  count: t.integer().notNull(),
}));

export const fiveMinuteBuckets = onchainTable("five_minute_buckets", (t) => ({
  pool: t.hex().notNull(),
  id: t.integer().primaryKey(),
  open: t.real().notNull(),
  close: t.real().notNull(),
  low: t.real().notNull(),
  high: t.real().notNull(),
  average: t.real().notNull(),
  count: t.integer().notNull(),
}));

export const fifteenMinuteBuckets = onchainTable("fifteen_minute_buckets", (t) => ({
  pool: t.hex().notNull(),
  id: t.integer().primaryKey(),
  open: t.real().notNull(),
  close: t.real().notNull(),
  low: t.real().notNull(),
  high: t.real().notNull(),
  average: t.real().notNull(),
  count: t.integer().notNull(),
}));

export const hourBuckets = onchainTable("hour_buckets", (t) => ({
  pool: t.hex().notNull(),
  id: t.integer().primaryKey(),
  open: t.real().notNull(),
  close: t.real().notNull(),
  low: t.real().notNull(),
  high: t.real().notNull(),
  average: t.real().notNull(),
  count: t.integer().notNull(),
}));

export const fourHourBuckets = onchainTable("four_hour_buckets", (t) => ({
  pool: t.hex().notNull(),
  id: t.integer().primaryKey(),
  open: t.real().notNull(),
  close: t.real().notNull(),
  low: t.real().notNull(),
  high: t.real().notNull(),
  average: t.real().notNull(),
  count: t.integer().notNull(),
}));

export const dayBuckets = onchainTable("day_buckets", (t) => ({
  pool: t.hex().notNull(),
  id: t.integer().primaryKey(),
  open: t.real().notNull(),
  close: t.real().notNull(),
  low: t.real().notNull(),
  high: t.real().notNull(),
  average: t.real().notNull(),
  count: t.integer().notNull(),
}));

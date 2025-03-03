import { ponder } from "ponder:registry";
import {
  dayBuckets,
  fifteenMinuteBuckets,
  fiveMinuteBuckets,
  fourHourBuckets,
  hourBuckets,
  oneMinuteBuckets,
} from "../ponder.schema";
import { getActualPrice } from "./hooks/getActualPrice";

const secondsInHour = 60 * 60;

ponder.on("UniswapV3Pool:Swap", async ({ event, context }) => {
  const { timestamp } = event.block;

  const price = getActualPrice(
    event.log.address.toLowerCase(),
    BigInt(event.args.sqrtPriceX96)
  );

  const secondsInMinute = 60;
  const secondsInFiveMinutes = 5 * 60;
  const secondsInFifteenMinutes = 15 * 60;
  const secondsInHour = 60 * 60;
  const secondsInFourHours = 4 * 60 * 60;
  const secondsInDay = 24 * 60 * 60;

  const minuteId =
    Math.floor(Number(timestamp) / secondsInMinute) * secondsInMinute;
  const fiveMinuteId =
    Math.floor(Number(timestamp) / secondsInFiveMinutes) * secondsInFiveMinutes;
  const fifteenMinuteId =
    Math.floor(Number(timestamp) / secondsInFifteenMinutes) *
    secondsInFifteenMinutes;
  const hourId = Math.floor(Number(timestamp) / secondsInHour) * secondsInHour;
  const fourHourId =
    Math.floor(Number(timestamp) / secondsInFourHours) * secondsInFourHours;
  const dayId = Math.floor(Number(timestamp) / secondsInDay) * secondsInDay;

  const bucketData = {
    open: price,
    close: price,
    low: price,
    high: price,
    average: price,
    count: 1,
  };

  const updateData = (row: any) => ({
    open: row.open,
    close: price,
    low: Math.min(row.low, price),
    high: Math.max(row.high, price),
    average: (row.average * row.count + price) / (row.count + 1),
    count: row.count + 1,
  });
  const pool_address = event.log.address;

  await Promise.all([
    context.db
      .insert(oneMinuteBuckets)
      .values({ id: minuteId, pool: pool_address, ...bucketData })
      .onConflictDoUpdate(updateData),
    context.db
      .insert(fiveMinuteBuckets)
      .values({ id: fiveMinuteId, pool: pool_address, ...bucketData })
      .onConflictDoUpdate(updateData),
    context.db
      .insert(fifteenMinuteBuckets)
      .values({ id: fifteenMinuteId, pool: pool_address, ...bucketData })
      .onConflictDoUpdate(updateData),
    context.db
      .insert(hourBuckets)
      .values({ id: hourId, pool: pool_address, ...bucketData })
      .onConflictDoUpdate(updateData),
    context.db
      .insert(fourHourBuckets)
      .values({ id: fourHourId, pool: pool_address, ...bucketData })
      .onConflictDoUpdate(updateData),
    context.db
      .insert(dayBuckets)
      .values({ id: dayId, pool: pool_address, ...bucketData })
      .onConflictDoUpdate(updateData),
  ]);
});

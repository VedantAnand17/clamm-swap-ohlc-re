import { ponder } from "ponder:registry";
import { dayBuckets, hourBuckets, oneMinuteBuckets } from "../ponder.schema";
import { getActualPrice } from "./hooks/getActualPrice";
import { POOL_CONFIGS } from "../poolConfig";

ponder.on("UniswapV3Pool:Swap", async ({ event, context }) => {
  const { timestamp } = event.block;
  const poolAddress = event.log.address.toLowerCase();

  const price = getActualPrice(poolAddress, BigInt(event.args.sqrtPriceX96));

  // Get pool configuration
  const poolConfig = POOL_CONFIGS[poolAddress];

  // Calculate volume using the non-volatile token amount
  let volume = 0n;

  if (poolConfig) {
    // Determine which token is non-volatile based on the pool configuration
    if (poolConfig.isToken1Volatile) {
      // Token0 is non-volatile (e.g., USDC in USDC/WETH pair)
      volume = BigInt(
        event.args.amount0 < 0 ? -event.args.amount0 : event.args.amount0
      );
    } else {
      // Token1 is non-volatile (e.g., USDC in WETH/USDC pair)
      volume = BigInt(
        event.args.amount1 < 0 ? -event.args.amount1 : event.args.amount1
      );
    }
  } else {
    // Fallback if pool config not found: use the smaller of the two amounts
    const amount0 = BigInt(
      event.args.amount0 < 0 ? -event.args.amount0 : event.args.amount0
    );
    const amount1 = BigInt(
      event.args.amount1 < 0 ? -event.args.amount1 : event.args.amount1
    );
    volume = amount0 > amount1 ? amount1 : amount0;
    console.warn(
      `Pool config not found for ${poolAddress}, using max volume as fallback`
    );
  }

  const secondsInMinute = 60;
  const secondsInHour = 60 * 60;
  const secondsInDay = 24 * 60 * 60;

  const minuteId =
    Math.floor(Number(timestamp) / secondsInMinute) * secondsInMinute;
  const hourId = Math.floor(Number(timestamp) / secondsInHour) * secondsInHour;
  const dayId = Math.floor(Number(timestamp) / secondsInDay) * secondsInDay;

  const bucketData = {
    open: price,
    close: price,
    low: price,
    high: price,
    average: price,
    count: 1,
    volume: volume,
  };

  const updateData = (row: any) => ({
    open: row.open,
    close: price,
    low: Math.min(row.low, price),
    high: Math.max(row.high, price),
    average: (row.average * row.count + price) / (row.count + 1),
    count: row.count + 1,
    volume: (row.volume || 0n) + volume,
  });
  const pool_address = event.log.address;

  await Promise.all([
    context.db
      .insert(oneMinuteBuckets)
      .values({ id: minuteId, pool: pool_address, ...bucketData })
      .onConflictDoUpdate(updateData),
    context.db
      .insert(hourBuckets)
      .values({ id: hourId, pool: pool_address, ...bucketData })
      .onConflictDoUpdate(updateData),
    context.db
      .insert(dayBuckets)
      .values({ id: dayId, pool: pool_address, ...bucketData })
      .onConflictDoUpdate(updateData),
  ]);
});

import { Hono } from "hono";
import { client, graphql } from "ponder";
import { db } from "ponder:api";
import schema from "ponder:schema";
import { oneMinuteBuckets } from "../../ponder.schema";
import { sql } from "ponder";

// Create a new Hono app
const app = new Hono();

app.use("/sql/*", client({ db, schema }));
app.use("/", graphql({ db, schema }));
app.use("/graphql", graphql({ db, schema }));

/**
 * Gets the current price and 24-hour percentage change for a given pool
 * @param poolAddress The address of the Uniswap V3 pool
 * @returns Object containing current price and 24-hour percentage change
 */
async function getPriceAndChange(poolAddress: string): Promise<{
  currentPrice: number;
  percentChange: number;
  timestamp: number;
  debug?: any;
}> {
  const normalizedPoolAddress = poolAddress.toLowerCase();
  const currentTime = Math.floor(Date.now() / 1000);

  // Get the latest price (most recent 1-minute bucket)
  const latestBuckets = await db
    .select()
    .from(oneMinuteBuckets)
    .where(sql`${oneMinuteBuckets.pool} = ${normalizedPoolAddress}`)
    .orderBy(sql`${oneMinuteBuckets.id} DESC`)
    .limit(1);

  if (latestBuckets.length === 0) {
    throw new Error(`No price data found for pool ${poolAddress}`);
  }

  // We've checked that latestBuckets has at least one element
  const latestBucket = latestBuckets[0];
  if (!latestBucket) {
    throw new Error(`No price data found for pool ${poolAddress}`);
  }

  const currentPrice = Number(latestBucket.close);
  const currentTimestamp = latestBucket.id;

  // Get the price from 24 hours ago
  const oneDayAgo = currentTime - 24 * 60 * 60;

  // First try to get a data point that's closest to 24 hours ago
  const dayAgoBuckets = await db
    .select()
    .from(oneMinuteBuckets)
    .where(
      sql`${oneMinuteBuckets.pool} = ${normalizedPoolAddress} AND ${oneMinuteBuckets.id} <= ${oneDayAgo}`
    )
    .orderBy(sql`${oneMinuteBuckets.id} DESC`)
    .limit(1);

  let percentChange = 0;
  let oldPrice: number | null = null;
  let oldTimestamp: number | null = null;
  let debug: any = {
    method: "none",
    currentPrice,
    oldPrice: null,
    currentTimestamp,
  };

  if (dayAgoBuckets.length > 0 && dayAgoBuckets[0]) {
    // We have data from 24 hours ago
    oldPrice = Number(dayAgoBuckets[0].close);
    oldTimestamp = dayAgoBuckets[0].id;

    // Verify we're not using the same data point
    if (oldTimestamp === currentTimestamp) {
      // If we got the same timestamp, try to get an older data point
      const olderBuckets = await db
        .select()
        .from(oneMinuteBuckets)
        .where(
          sql`${oneMinuteBuckets.pool} = ${normalizedPoolAddress} AND ${oneMinuteBuckets.id} < ${currentTimestamp}`
        )
        .orderBy(sql`${oneMinuteBuckets.id} DESC`)
        .limit(1);

      if (olderBuckets.length > 0 && olderBuckets[0]) {
        oldPrice = Number(olderBuckets[0].close);
        oldTimestamp = olderBuckets[0].id;
        debug = {
          method: "older_point",
          currentPrice,
          oldPrice: oldPrice as number,
          currentTimestamp,
          oldTimestamp,
        };
      } else {
        // No older data points available
        return {
          currentPrice,
          percentChange: 0,
          timestamp: currentTimestamp,
          debug: {
            method: "no_older_points",
            currentPrice,
            currentTimestamp,
          },
        };
      }
    } else {
      debug = {
        method: "24h",
        currentPrice,
        oldPrice: oldPrice as number,
        currentTimestamp,
        oldTimestamp,
      };
    }
  } else {
    // No 24h data, get the oldest data point instead
    const oldestBuckets = await db
      .select()
      .from(oneMinuteBuckets)
      .where(sql`${oneMinuteBuckets.pool} = ${normalizedPoolAddress}`)
      .orderBy(sql`${oneMinuteBuckets.id} ASC`)
      .limit(1);

    if (
      oldestBuckets.length > 0 &&
      oldestBuckets[0] &&
      oldestBuckets[0].id !== currentTimestamp
    ) {
      oldPrice = Number(oldestBuckets[0].close);
      oldTimestamp = oldestBuckets[0].id;
      debug = {
        method: "oldest",
        currentPrice,
        oldPrice: oldPrice as number,
        currentTimestamp,
        oldTimestamp,
      };
    } else {
      // If there's only one data point or no older data, return 0% change
      return {
        currentPrice,
        percentChange: 0,
        timestamp: currentTimestamp,
        debug: {
          method: "single_point",
          currentPrice,
          currentTimestamp,
        },
      };
    }
  }

  // Make sure we have valid numbers for calculation
  if (
    typeof currentPrice !== "number" ||
    isNaN(currentPrice) ||
    typeof oldPrice !== "number" ||
    isNaN(oldPrice) ||
    oldPrice === 0
  ) {
    return {
      currentPrice,
      percentChange: 0,
      timestamp: currentTimestamp,
      debug: {
        method: "invalid_numbers",
        currentPrice,
        oldPrice,
        currentTimestamp,
        oldTimestamp,
      },
    };
  }

  percentChange = ((currentPrice - oldPrice) / oldPrice) * 100;

  return {
    currentPrice,
    percentChange: parseFloat(percentChange.toFixed(2)),
    timestamp: currentTimestamp,
    debug,
  };
}

/**
 * Gets all available pools with their current price and 24-hour percentage change
 * @returns Array of objects containing price data for each available pool
 */
async function getAllPoolsData(): Promise<
  Array<{
    poolAddress: string;
    currentPrice: number;
    percentChange: number;
    timestamp: number;
    debug?: any;
  }>
> {
  // Get all unique pool addresses
  const poolsResult = await db
    .select({ pool: oneMinuteBuckets.pool })
    .from(oneMinuteBuckets)
    .groupBy(oneMinuteBuckets.pool);

  const poolAddresses = poolsResult.map((row) => row.pool);

  // Get price data for each pool
  const results = await Promise.all(
    poolAddresses.map(async (poolAddress) => {
      try {
        const data = await getPriceAndChange(poolAddress);
        return {
          poolAddress,
          currentPrice: data.currentPrice,
          percentChange: data.percentChange,
          timestamp: data.timestamp,
          debug: data.debug,
        };
      } catch (error) {
        // Skip pools with errors
        return null;
      }
    })
  );

  // Filter out null results (pools with errors)
  return results.filter((result) => result !== null) as Array<{
    poolAddress: string;
    currentPrice: number;
    percentChange: number;
    timestamp: number;
    debug?: any;
  }>;
}

/**
 * Gets the current price and 24-hour percentage change for multiple pools in a single batch
 * @param poolAddresses Array of Uniswap V3 pool addresses
 * @returns Array of objects containing price data for each pool
 */
async function getBatchPriceAndChange(poolAddresses: string[]): Promise<
  Array<{
    poolAddress: string;
    currentPrice: number | null;
    percentChange: number | null;
    timestamp: number | null;
    error: string | null;
    debug?: any;
  }>
> {
  if (poolAddresses.length === 0) {
    return [];
  }

  try {
    const results = await Promise.all(
      poolAddresses.map(async (poolAddress) => {
        try {
          const data = await getPriceAndChange(poolAddress);
          return {
            poolAddress,
            currentPrice: data.currentPrice,
            percentChange: data.percentChange,
            timestamp: data.timestamp,
            error: null,
            debug: data.debug,
          };
        } catch (error) {
          return {
            poolAddress,
            currentPrice: null,
            percentChange: null,
            timestamp: null,
            error: error instanceof Error ? error.message : "Unknown error",
            debug: { error: true },
          };
        }
      })
    );

    return results;
  } catch (error) {
    // If there's an error with the database query, return error for all pools
    const errorMessage =
      error instanceof Error ? error.message : "Unknown database error";
    return poolAddresses.map((poolAddress) => ({
      poolAddress,
      currentPrice: null,
      percentChange: null,
      timestamp: null,
      error: errorMessage,
      debug: { error: true, message: errorMessage },
    }));
  }
}

// Endpoint to get current price and 24h change for a single pool
app.get("/price/:poolAddress", async (c) => {
  try {
    const poolAddress = c.req.param("poolAddress");
    const priceData = await getPriceAndChange(poolAddress);

    // Remove debug info in production
    const { debug, ...cleanData } = priceData;

    // Include debug info if requested
    const includeDebug = c.req.query("debug") === "true";
    return c.json(includeDebug ? priceData : cleanData);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return c.json({ error: errorMessage }, 404);
  }
});

// Endpoint to get price data for multiple pools at once
app.post("/prices", async (c) => {
  try {
    const includeDebug = c.req.query("debug") === "true";
    let body;
    try {
      body = await c.req.json();
    } catch (parseError) {
      // If JSON parsing fails, return all available pools
      const allPoolsData = await getAllPoolsData();

      // Remove debug info unless requested
      const cleanData = allPoolsData.map((item) => {
        const { debug, ...rest } = item;
        return includeDebug ? item : rest;
      });

      return c.json({ results: cleanData });
    }

    // If body is empty or doesn't contain poolAddresses, return all available pools
    if (!body || !body.poolAddresses || !Array.isArray(body.poolAddresses)) {
      const allPoolsData = await getAllPoolsData();

      // Remove debug info unless requested
      const cleanData = allPoolsData.map((item) => {
        const { debug, ...rest } = item;
        return includeDebug ? item : rest;
      });

      return c.json({ results: cleanData });
    }

    const poolAddresses = body.poolAddresses as string[];

    if (poolAddresses.length === 0) {
      // If empty array is provided, return all available pools
      const allPoolsData = await getAllPoolsData();

      // Remove debug info unless requested
      const cleanData = allPoolsData.map((item) => {
        const { debug, ...rest } = item;
        return includeDebug ? item : rest;
      });

      return c.json({ results: cleanData });
    }

    if (poolAddresses.length > 50) {
      return c.json({ error: "Maximum of 50 pool addresses allowed" }, 400);
    }

    const results = await getBatchPriceAndChange(poolAddresses);

    // Remove debug info unless requested
    const cleanResults = results.map((item) => {
      const { debug, ...rest } = item;
      return includeDebug ? item : rest;
    });

    return c.json({ results: cleanResults });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Invalid request";
    return c.json({ error: errorMessage }, 400);
  }
});

// Endpoint to get price data for all available pools
app.get("/prices/all", async (c) => {
  try {
    const includeDebug = c.req.query("debug") === "true";
    const allPoolsData = await getAllPoolsData();

    // Remove debug info unless requested
    const cleanData = allPoolsData.map((item) => {
      const { debug, ...rest } = item;
      return includeDebug ? item : rest;
    });

    return c.json({ results: cleanData });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return c.json({ error: errorMessage }, 500);
  }
});

export default app;

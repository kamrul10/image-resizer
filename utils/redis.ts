import redis from "redis";
import { promisify } from "util";
import logger from "./logger";
const client = redis.createClient(process.env.REDIS_URL);

// configure redis cieent for async operations
const redisClient = {
  ...client,
  getAsync: promisify(client.get).bind(client),
  setAsync: promisify(client.set).bind(client),
  keysAsync: promisify(client.keys).bind(client),
  deleteAsync:promisify(client.del).bind(client)
};
export default redisClient;
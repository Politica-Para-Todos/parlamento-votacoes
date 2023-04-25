import * as dotenv from 'dotenv';
import * as redis from 'redis';

export const bootstrap = async () => {
  console.log('Start configuration...');

  dotenv.config();

  await startRedisDatabaseConnection();

  try {
    if (process.env.DISCORD_WEB_HOOK == undefined) {
      console.error('Please provide a value to DISCORD_WEB_HOOK variable');
      process.exit(1);
    }
    new URL(process.env.DISCORD_WEB_HOOK);
    console.log('Configuration completed.');
  } catch (error) {
    throw Error(error.message);
  }
}

export const redisClient = process.env.REDISCLOUD_URL !== undefined ?
  redis.createClient({ url: process.env.REDISCLOUD_URL }) :
  redis.createClient();

const startRedisDatabaseConnection = async () => {
  console.log('Start Redis database connection...');

  redisClient.on('error', () => redisClient.quit());
  await redisClient.connect();

  console.log('Redis database is connected.');
}

export const closeRedisDatabaseConnection = async (reason) => {
  await redisClient.quit()
}

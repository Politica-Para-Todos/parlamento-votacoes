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

export const redisClient = process.env.NODE_ENV !== 'local' ? redis.createClient() : redis.createClient(redisConfig);

const startRedisDatabaseConnection = async () => {
  console.log('Start Redis database connection...');

  redisClient.on('error', err => console.log('Redis Client Error: ', err));
  await redisClient.connect();

  console.log('Redis database is connected.');
}

const redisConfig = () => {
  if (process.env.REDISCLOUD_URL !== undefined) {
    return {
      url: process.env.REDISCLOUD_URL
    }
  }
}

export const closeRedisDatabaseConnection = async (reason) => {
  await redisClient.quit()
}
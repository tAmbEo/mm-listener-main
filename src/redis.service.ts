import { Injectable } from '@nestjs/common';
import { createClient } from 'redis';

@Injectable()
export class RedisService {
  private redisClient = createClient({
    socket: {
      host: process.env.REDIS_HOST,
      port: +process.env.REDIS_PORT,
    },
    password: process.env.REDIS_PWD,
  });

  constructor() {
    (async () => {
      await this.redisClient.connect();
    })();
  }

  async set(store: string, payload: string): Promise<any> {
    return await this.redisClient.SET(store, payload);
  }

  async setex(
    store: string,
    expireSecond: number,
    payload: string,
  ): Promise<any> {
    return await this.redisClient.SETEX(store, expireSecond, payload);
  }

  async exists(store: any): Promise<any> {
    return !!(await this.redisClient.EXISTS(store));
  }

  async remove(store: any): Promise<any> {
    return await this.redisClient.del(store);
  }

  async get(key: string): Promise<any> {
    return await this.redisClient.get(key);
  }

  async clearKeys(key: string): Promise<any> {
    const keys = await this.getAll(key, true);
    if (keys.length) await this.remove(keys);
    return true;
  }

  async getAll(store: string, getKeysOnly?: boolean): Promise<any> {
    const getSingleValue = async (key) => {
      const value = await this.redisClient.get(key);
      if (!value) return null;
      try {
        return JSON.parse(value);
      } catch (e) {
        return value
      }
    };

    const values = await this.redisClient.keys(store);
    if (getKeysOnly) return values;
    const results = [];
    for (const value of values) results.push(await getSingleValue(value));
    return results.filter(Boolean);
  }

  async addSet(store: string, key: string): Promise<any> {
    return await this.redisClient.SADD(store, key);
  }

  async checkSet(store: string, key: string): Promise<any> {
    return await this.redisClient.SISMEMBER(store, key);
  }

  async getFunc(key: string, func: () => any, ttl = 60 * 60) {
    const dataCached = await this.get(key);
    if (dataCached !== null) {
      try {
        return JSON.parse(dataCached);
      } catch (err) { } // ingore
    }
    const data = await func();
    await this.setex(key, ttl, JSON.stringify(data));
    return data;
  }
}

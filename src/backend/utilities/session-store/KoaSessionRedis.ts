import redis from "redis";
import { promisify } from "util";

const debug = require("debug")("koa:session-store-redis");

export default class RedisSessionStore {
  client: any;

  constructor(options) {
    this.client = redis.createClient(options);

    // if you'd like to select database 3, instead of 0 (default), call
    // client.select(3, function() { /* ... */ })

    this.client.on("connect", () => {
      debug("connected to redis");
    });
    this.client.on("ready", () => {
      debug("redis ready");
    });
    this.client.on("end", () => {
      debug("redis ended");
    });
    this.client.on("error", () => {
      debug("redis error");
    });
    this.client.on("reconnecting", () => {
      debug("redis reconnecting");
    });
    this.client.on("warning", () => {
      debug("redis warning");
    });
  }

  async get(key) {
    const getAsync = promisify(this.client.get).bind(this.client);
    const json = await getAsync(key);
    debug(`GET ${key} -> ${json}`);
    return JSON.parse(json);
  }

  async set(key, sess, ttl) {
    const json = JSON.stringify(sess);
    debug(`SET ${key} -> ${json}`);
    if (typeof ttl === "number") {
      ttl = Math.ceil(ttl / 1000);
    }
    if (ttl) {
      const setexAsync = promisify(this.client.setex).bind(this.client);
      await setexAsync(key, ttl, json);
    } else {
      const setAsync = promisify(this.client.set).bind(this.client);
      await setAsync(key, json);
    }
  }

  async destroy(key) {
    debug(`DELETE ${key}`);
    const delAsync = promisify(this.client.del).bind(this.client);
    await delAsync(key);
  }

  async quit() {
    debug("QUIT redis");
    this.client.quit();
  }
}

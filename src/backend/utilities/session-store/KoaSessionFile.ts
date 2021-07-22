/**
 *
 * TODO:
 * Add Atomic locks
 */

import fs from 'fs';
import util from 'util';
import Logger from '../Logger';

const debug = require('debug')('koa:session-store-file');

const Config = require('./../../../../config/config');

const stat = util.promisify(fs.stat);
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const unlinkFile = util.promisify(fs.unlink);
const readdir = util.promisify(fs.readdir);


/**
 * RedisStore for koa-session
 *
 * @param {object} options the options pass to node_redis
 * @returns FileSessionStore instance
 */

export default class FileSessionStore {
    
    storePath: string;

    constructor(options = undefined) {
        const opt = options || {};
        debug(`FileSessionStore Options ${opt}`);
        this.storePath = `${Config.Path.Root.Data.SESSIONS}/`;
        const stats = fs.existsSync(this.storePath);
        if (!stats) {
            try {
                fs.mkdirSync(this.storePath);
            } catch (e) {
                Logger.error('Error creating session store folder in data folder');
                Logger.error(e);
            }
        }
    }

    async get(key) {
        const filePath = this.storePath + key;
        let response = '';

        try {
            const json = await readFile(filePath);
            debug(`GET ${key} -> ${json}`);
            response = JSON.parse(json);
        } catch (e) {
            debug(`GET ERROR ${key} -> no Session `);
        }

        return response;
    }

    async set(key, sess, ttl) {
        const filePath = this.storePath + key;

        const json = JSON.stringify(sess);
        debug(`SET ${key} -> ${json}`);
        debug(`TTL ${ttl}`);

        try {
            await writeFile(filePath, json);
        } catch (e) {
            debug(`CANNOT SET SESSION ${key}`);
        }
    }

    async destroy(key) {
        const filePath = this.storePath + key;
        debug(`DELETE ${filePath}`);
        try {
            const stats = await stat(filePath);
            if (stats.isFile()) {
                await unlinkFile(filePath);
            }
        } catch (e) {
            debug(`DELETE ${filePath} not successful`);
        }
    }

    async quit() {
        const files = await readdir(this.storePath);
        for (let i = 0; i < files.length; i++) {
            const filename = files[i];
            const fullPath = this.storePath + filename;
            try {
                const stats = await stat(fullPath);
                if (stats.isFile()) {
                    await unlinkFile(fullPath);
                }
            } catch (e) {
                debug(`QUIT ERROR AT FILE ${fullPath} not successful deleted`);
            }
        }
    }
}

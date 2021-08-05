import Koa from 'koa';
import KoaBodyParser from 'koa-bodyparser';
import Session from 'koa-session';

import Router from './backend/requests/filters/Router';
import DatabasePool from './backend/utilities/database/DatabasePool';
import Logger from './backend/utilities/Logger';

import FileSessionStore from './backend/utilities/session-store/KoaSessionFile';
import RedisSessionStore from './backend/utilities/session-store/KoaSessionRedis';

const Config = require('../config/config');

let sessionStore;
// if (Config.Build.DEV === true) {
    sessionStore = new FileSessionStore();
// } else {
//     sessionStore = new RedisSessionStore({ 'host': Config.Server.SESSION_STORE_ADDR, 'port': Config.Server.SESSION_STORE_PORT });
// }

// if (Config.Build.DEV === true) {
//     const FileSessionStore = require(Config.Path.Backend.UTILITIES + '/session-store/koa-session-file');
//     sessionStore = new FileSessionStore();
//     Logger.log('Set FileSessionStore for cookie');
// } else {
//     const RedisSessionStore = require(Config.Path.Backend.UTILITIES + '/session-store/koa-session-redis');
//     sessionStore = new RedisSessionStore({'host': Config.Server.SESSION_STORE_ADDR, 'port': Config.Server.SESSION_STORE_PORT});
//     Logger.log('Set RedisSessionStore for cookie');
// }

const SESSION_CONFIG = {
    key: 'reactnode',
    /** (string) cookie key (default is koa:sess) */
    /** (number || 'session') maxAge in ms (default is 1 days) */
    /** 'session' will result in a cookie that expires when session/browser is closed */
    /** Warning: If a session cookie is stolen, this cookie will never expire */
    maxAge: 86400000,
    overwrite: true,
    /** (boolean) can overwrite or not (default true) */
    httpOnly: true,
    /** (boolean) httpOnly or not (default true) */
    signed: true,
    /** (boolean) signed or not (default true) */
    rolling: false,
    /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
    renew: true,
    /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false) */
    store: sessionStore,
};

class ServerWorker {

    app: Koa;
    dbPool: DatabasePool;
    port: number;
    sessionKey: string;
    count: number;

    constructor(port: number, sessionKey: string, dbPool: DatabasePool) {
        this.port = port;
        this.app = new Koa();
        this.count = 0;
        this.app.keys = [sessionKey];
        this.dbPool = dbPool;
    }

    start() {
        this.app.proxy = true;
        this.app.use(KoaBodyParser({ formLimit: '128mb' }));
        this.app.use(Session(SESSION_CONFIG, this.app));

        Router.init(this.dbPool);
        this.app.use(Router.onRequest);

        this.app.listen(this.port, () => {
            Logger.log(`Worker process: ${process.pid} listen on port ${this.port}`);
        });

        this.app.on('error', (e) => {
            Logger.error('Promise error', e);
        });
    }
}

module.exports = ServerWorker;

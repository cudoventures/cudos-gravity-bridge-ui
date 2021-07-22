/* global TR */
/* eslint-disable no-fallthrough */

import fs from 'fs';
import util from 'util';

import Payload from '../../utilities/network/Payload';
import GeneralFilter from './GeneralFilter';
import CAdminFilter from './CAdminFilter';
import ApiFilter from './ApiFilter';
import Session from '../../utilities/Session';
import Logger from '../../utilities/Logger';
import TR from '../../utilities/TR';
import StateException from '../../utilities/network/StateException';
import Response from '../../utilities/network/Response';
import DatabasePool from '../../utilities/database/DatabasePool';
import ServicesFactory from '../../services/common/ServicesFactory';
import Context from '../../utilities/network/Context';
import Database from '../../utilities/database/Database';

const Config = require('./../../../../config/config');

const statAsync = util.promisify(fs.stat);

const TR_EN = JSON.stringify(TR.EN);

export default class Router {

    static dbPool: DatabasePool | null = null;

    static init(dbPool: DatabasePool) {
        Router.dbPool = dbPool;
        ApiFilter.init();
        GeneralFilter.init();
        CAdminFilter.init();
    }

    static async onRequest(ctx) {
        Router.processCtx(ctx);

        const db: Database = null;
        try {
            if ((await Router.processResources(ctx)) === true) {
                return;
            }

            const payload = new Payload(ctx);
            const session = new Session(ctx);
            // db = await Router.dbPool.aquireConnection();
            const servicesFactory = new ServicesFactory(db);
            const context = new Context(payload, session, servicesFactory);

            ctx.set('Cache-Control', 'no-cache, max-age=0, must-revalidate, no-store');

            const response = await ApiFilter.onRequest(context);
            if (response !== null) {
                ctx.body = response;
                return;
            }

            if (await CAdminFilter.onRequest(context) === true) {
                return;
            }
            if (await GeneralFilter.onRequest(context) === true) {
                return;
            }
        } catch (e) {
            // No need to log it here, because winston logger does it
            // if (Config.Build.DEV === true) {
            //     console.error(e);
            // }

            if (e instanceof StateException) {
                switch (e.errorCode) {
                    default:
                    case Response.S_STATUS_DO_NOT_HANDLE:
                        const res = new Response();
                        res.setStatus(e.errorCode);
                        ctx.body = res;
                        break;
                    case Response.S_STATUS_RUNTIME_ERROR:
                        Router.processRequestError(ctx, e);
                        break;
                }
            } else {
                Router.processRequestError(ctx, e);
            }
            if (db !== null) {
                db.rollbackTransaction();
            }
        } finally {
            if (db !== null) {
                // Router.dbPool.releaseConnection(db);
            }
        }
    }

    static processRequestError(ctx, e) {
        ctx.response.status = 500;
        ctx.body = `${Date.now()}#${parseInt(Math.random() * 100000)}`;
        Logger.error(e);
    }

    static processCtx(ctx) {
        if (ctx.URL.pathname[ctx.URL.pathname.length - 1] === '/') {
            ctx.URL.pathname = ctx.URL.pathname.substring(0, ctx.URL.pathname.length - 1);
        }

        // load this values based on session
        ctx.TR_STRING = TR_EN;
        ctx.TR = TR.EN;
    }

    static async processResources(ctx) {
        const url = ctx.URL.pathname;

        const i = Math.max(0, url.length - 6);
        let ext = null;
        for (let j = url.length - 1; j-- > i;) {
            if (url[j] === '.') {
                ext = url.substring(j + 1);
                break;
            }
        }

        const path = Config.Path.Root.FRONTEND + url;
        let contentType = null;
        switch (ext) {
            case 'png':
            case 'jpg':
            case 'jpeg':
            case 'gif':
            case 'bmp':
                contentType = contentType === null ? `image/${ext}` : contentType;
            case 'woff2':
                contentType = contentType === null ? `application/font-${ext}` : contentType;
            case 'woff':
                contentType = contentType === null ? `application/font-${ext}` : contentType;
            case 'ttf':
                contentType = contentType === null ? `application/font-${ext}` : contentType;
            case 'mp4':
                contentType = contentType === null ? `video/${ext}` : contentType;
            case 'js':
                contentType = contentType === null ? 'application/javascript' : contentType;
            case 'svg':
                contentType = contentType === null ? 'image/svg+xml' : contentType;
            case 'css':
                contentType = contentType === null ? 'text/css' : contentType;

                try {
                    if (ext === 'mp4') {
                        if (await this.processVideoFile(ctx, path) === true) {
                            return true;
                        }
                    }

                    const stats = await statAsync(path);
                    ctx.set('Content-Type', contentType);
                    ctx.set('Content-Length', stats.size);
                    ctx.set('Cache-Control', 'max-age=2592000, public');
                    ctx.body = fs.createReadStream(path);
                } catch (e) {
                }

                return true;
            default:
                return false;
        }
    }

    static async processVideoFile(ctx, path) {
        const range = ctx.header.range;
        if (!range) {
            return false;
        }
        const ranges = this.rangeParse(range);
        let [start, end] = ranges[0];
        const stats = await statAsync(path);
        const fileSize = stats.size;
        ctx.status = 206;
        end = end === Infinity ? fileSize - 1 : end;
        ctx.set('Content-Type', 'video/mp4');
        ctx.set('Accept-Ranges', `0-${fileSize}`);
        ctx.set('Content-Range', `bytes ${start}-${end}/${fileSize}`);
        ctx.set('Content-Length', end - start + 1);
        ctx.body = fs.createReadStream(path, { start, end });

        return true;
    }

    static rangeParse(str) {
        const token = str.split('=');
        if (!token || token.length !== 2 || token[0] !== 'bytes') {
            return null;
        }
        return token[1]
            .split(',')
            .map((range) => {
                return range.split('-').map((value) => {
                    if (value === '') {
                        return Infinity;
                    }
                    return Number(value);
                });
            })
            .filter((range) => {
                return !isNaN(range[0]) && !isNaN(range[1]) && range[0] <= range[1];
            });
    }
}

import mysql, { MysqlError, Pool, PoolConnection } from 'mysql';
import fs from 'fs';

import Config from '../../../../config/config';
import Database from './Database';

export default class DatabasePool {

    pool: Pool;

    constructor() {
        this.pool = mysql.createPool({
            connectionLimit: Config.Database.LIMIT,
            port: Config.Database.PORT,
            host: Config.Database.HOST,
            user: Config.Database.USER,
            password: Config.Database.PASSWORD,
            database: Config.Database.NAME,
            charset: 'utf8mb4',
        });
    }

    aquireConnection(): Promise < Database > {
        return new Promise < Database >((resolve, reject) => {
            this.pool.getConnection((er: MysqlError, dbc: PoolConnection) => {
                if (er) {
                    reject(er);
                    return;
                }

                resolve(new Database(dbc));
            });
        });
    }

    releaseConnection(db: Database): void {
        db.release();
    }

    close() {
        return new Promise < void >((resolve, reject) => {
            this.pool.end((er: MysqlError) => {
                // Do not use ER object.
                // Any access to it leads to nothing, abosutely nothing below the access itself is executed. It is like the event loop goes directly to the next iteration.
                resolve();
            });
        });

    }

}

import mysql from 'mysql';

import Database from './Database';
import RepoFactory from './RepoFactory';


export default class Repo {

    db: Database;
    repoFactory: RepoFactory;

    constructor(repoFactory: RepoFactory) {
        this.db = repoFactory.db;
        this.repoFactory = repoFactory;
    }

    escapeAndPrepareForDb(dbObj: any) {
        for (let i = dbObj[1].length; i-- > 0;) {
            dbObj[1][i] = `${mysql.escape(dbObj[1][i])}`;
        }

        return {
            names: dbObj[0].join(','),
            values: dbObj[1].join(','),
        };
    }

}

import Database from './Database';

export default class RepoFactory {

    db: Database;

    constructor(db: Database) {
        this.db = db;
    }

}

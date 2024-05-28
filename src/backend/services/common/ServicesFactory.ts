import Database from "../../utilities/database/Database";
import RepoFactory from "../../utilities/database/RepoFactory";

export default class ServicesFactory {
  db: Database;
  repoFactory: RepoFactory;

  constructor(db: Database) {
    this.db = db;
    this.repoFactory = new RepoFactory(db);
  }
}

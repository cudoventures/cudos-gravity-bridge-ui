import fs from "fs";
import { EOL } from "os";
import path from "path";

import Database from "../../utilities/database/Database";
import DatabasePool from "../../utilities/database/DatabasePool";

const Config = require("../../../../config/config");

const DB_MIGRATIONS_TABLE_NAME = "migrations";
const DB_MIGRATION_NAME = "migration_name";
const DB_MIGRATION_TIME = "migration_time";

const MIGRATIONS = `${__dirname}/../migrations`;

class ExecuteMigration {
  static async migrate() {
    const dbPool = new DatabasePool();
    let db = null;
    try {
      db = await dbPool.aquireConnection();
      await ExecuteMigration.execute(db, MIGRATIONS);
    } catch (ex) {
      console.error("error executing migrations");
      console.error(ex);
    } finally {
      if (db !== null) {
        dbPool.releaseConnection(db);
      }
      await dbPool.close();
    }
  }

  private static async execute(
    db: Database,
    migrationsDir: string,
    output: boolean = true
  ) {
    await db.query(`CREATE TABLE IF NOT EXISTS ${DB_MIGRATIONS_TABLE_NAME}(
                            id INT NOT NULL AUTO_INCREMENT,
                            ${DB_MIGRATION_NAME} VARCHAR(120) NOT NULL,
                            ${DB_MIGRATION_TIME} TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                            PRIMARY KEY(id)
                        ) DEFAULT CHARACTER SET utf8mb4, DEFAULT COLLATE utf8mb4_bin, ENGINE = InnoDB`);

    const oldMigrationsSet = new Set<string>();
    let sqlResult = await db.query(`SELECT * FROM ${DB_MIGRATIONS_TABLE_NAME}`);
    sqlResult.forEach(row => {
      oldMigrationsSet.add(row[DB_MIGRATION_NAME]);
    });

    sqlResult = await db.query(
      `SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME NOT IN ('migrations') AND TABLE_SCHEMA='${Config.Database.NAME}'`
    );
    if (sqlResult.length === 0) {
      oldMigrationsSet.clear();
    } else if (oldMigrationsSet.size === 0) {
      await db.query(
        `INSERT INTO ${DB_MIGRATIONS_TABLE_NAME}(${DB_MIGRATION_NAME}) VALUES('00000000000000-init')`
      );
      oldMigrationsSet.add("00000000000000-init");
    }

    const files = fs.readdirSync(migrationsDir);
    for (let i = 0; i < files.length; ++i) {
      const migrationName = path.basename(files[i]);
      if (oldMigrationsSet.has(migrationName) === true) {
        continue;
      }

      const MigrationClass = require(path.join(migrationsDir, files[i]));
      const migrationInst = new MigrationClass();

      try {
        await db.beginTransaction();

        if (output === true) {
          console.log(`Migrating ${migrationName}${EOL}`);
        }
        await migrationInst.up(db);
        await db.query(
          `INSERT INTO ${DB_MIGRATIONS_TABLE_NAME}(${DB_MIGRATION_NAME}) VALUES('${migrationName}')`
        );
      } catch (ex) {
        if (output === true) {
          console.error(`Migration failed ${migrationName}${EOL}`);
          console.error(ex);
        }
        await migrationInst.down(db);
        await db.rollbackTransaction();
        break;
      } finally {
        await db.comminTransaction();
      }
    }
  }
}

module.exports = ExecuteMigration;

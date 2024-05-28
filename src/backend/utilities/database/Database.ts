import mysql, { MysqlError, PoolConnection } from "mysql";
import DatabaseWhere from "./DatabaseWhere";
import Config from "../../../../config/config";
import Logger from "../Logger";

export default class Database {
  dbc: PoolConnection;

  constructor(dbc: PoolConnection) {
    this.dbc = dbc;
  }

  release() {
    this.dbc.release();
  }

  async save(tableName: string, repoObj: any) {
    const dbObj = repoObj.getDbPairs();

    for (let i = dbObj[1].length; i-- > 0; ) {
      dbObj[1][i] =
        dbObj[1][i] === null ? "NULL" : `${mysql.escape(dbObj[1][i])}`;
    }

    const dbPrimaryObj = repoObj.getPrimaryDbPair();
    dbPrimaryObj[1] =
      dbPrimaryObj[1] === null ? "NULL" : `${mysql.escape(dbPrimaryObj[1])}`;

    let insert = false;
    if (repoObj.getPrimaryValue() === null) {
      insert = true;
    } else {
      const result = await this.query(
        `SELECT ${dbPrimaryObj[0]} FROM ${tableName} WHERE ${dbPrimaryObj[0]} = ${dbPrimaryObj[1]}`
      );
      insert = result.length === 0;
    }

    if (insert === true) {
      if (repoObj.getPrimaryValueForInsert() !== null) {
        dbObj[0].push(dbPrimaryObj[0]);
        dbObj[1].push(dbPrimaryObj[1]);
      }

      const columns = dbObj[0].join(",");
      const values = dbObj[1].join(",");

      const sqlResult = await this.query(
        `INSERT INTO ${tableName}(${columns}) VALUES(${values})`
      );

      if (repoObj.getPrimaryValueForInsert() === null) {
        repoObj.setPrimaryValue(sqlResult.insertId);
      }
    } else {
      const pairs = dbObj[0]
        .map((_, i) => {
          return `${dbObj[0][i]} = ${dbObj[1][i]}`;
        })
        .join(",");

      await this.query(
        `UPDATE ${tableName} SET ${pairs} WHERE  ${dbPrimaryObj[0]} = ${dbPrimaryObj[1]}`
      );
    }

    return repoObj;
  }

  async batchInsert(tableName: string, repoObjs: any[]) {
    let columns = null;
    const values = null;

    for (let i = 0; i < repoObjs.length; ++i) {
      const repoObj = repoObjs[i];
      const dbObj = repoObj.getDbPairs();

      for (let j = dbObj[1].length; j-- > 0; ) {
        dbObj[1][j] =
          dbObj[1][j] === null ? "NULL" : `${mysql.escape(dbObj[1][j])}`;
      }

      if (repoObj.getPrimaryValueForInsert() !== null) {
        const dbPrimaryObj = repoObj.getPrimaryDbPair();
        dbPrimaryObj[1] =
          dbPrimaryObj[1] === null
            ? "NULL"
            : `${mysql.escape(dbPrimaryObj[1])}`;

        dbObj[0].push(dbPrimaryObj[0]);
        dbObj[1].push(dbPrimaryObj[1]);
      }

      if (columns === null) {
        columns = dbObj[0].join(",");
      }
      values.push(dbObj[1].join(","));

      for (let j = 0; j < values.length; j += 1000) {
        const slicedValues = values.slice(j, j + 1000);
        const slicedValuesAsString = slicedValues.join("),(");
        await this.query(
          `INSERT INFO ${tableName}(${columns}) VALUES(${slicedValuesAsString})`
        );
      }
    }
  }

  async update(tableName: string, repoObj: any, databaseWhere: DatabaseWhere) {
    const dbObj = repoObj.getDbPairs();

    for (let i = dbObj[1].length; i-- > 0; ) {
      dbObj[1][i] =
        dbObj[1][i] === null ? "NULL" : `${mysql.escape(dbObj[1][i])}`;
    }

    const pairs = dbObj[0]
      .map((_, i) => {
        return `${dbObj[0][i]} = ${dbObj[1][i]}`;
      })
      .join(",");

    const sqlWhere = databaseWhere.build();

    await this.query(`UPDATE ${tableName} SET ${pairs} ${sqlWhere}`);
  }

  async fetch(
    tableName: string,
    columns: string[],
    databaseWhere: DatabaseWhere
  ) {
    const result = [];

    const sqlColumns = columns.join(",");
    const sqlwhere = databaseWhere.build();

    const sqlResult = await this.query(
      `SELECT ${sqlColumns} FROM ${tableName} ${sqlwhere}`
    );
    sqlResult.forEach(row => {
      result.push(row);
    });

    return result;
  }

  async delete(tableName: string, databaseWhere: DatabaseWhere) {
    const sqlWhere = databaseWhere.build();
    await this.query(`DELETE FROM ${tableName} ${sqlWhere}`);
  }

  async beginTransaction(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.dbc.beginTransaction(er => {
        if (er) {
          reject(er);
          return;
        }

        resolve();
      });
    });
  }

  async comminTransaction(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.dbc.commit(er => {
        if (er) {
          reject(er);
          return;
        }

        resolve();
      });
    });
  }

  async rollbackTransaction(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.dbc.rollback(er => {
        if (er) {
          reject(er);
          return;
        }

        resolve();
      });
    });
  }

  query(query: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      if (Config.Build.DEV === true) {
        Logger.db(query);
      }

      this.dbc.query(query, (er: MysqlError, result: any, fields) => {
        if (er) {
          reject(er);
          return;
        }

        resolve(result);
      });
    });
  }
}

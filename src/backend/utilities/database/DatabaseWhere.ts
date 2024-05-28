import DatabaseWhereClause from "./DatabaseWhereClause";

export default class DatabaseWhere {
  static ORDER_DIRECTION_ASC: string = "ASC";
  static ORDER_DIRECTION_DESC: string = "DESC";

  offset: number | null;
  limit: number | null;
  orderColumn: string | number | null;
  orderType: string;
  groupColumn: string | number | null;

  columnsClauses: DatabaseWhereClause[][];
  columnsClausesJoin: string[];

  constructor() {
    this.offset = null;
    this.limit = null;
    this.orderColumn = null;
    this.orderType = DatabaseWhere.ORDER_DIRECTION_ASC;
    this.groupColumn = null;

    this.columnsClauses = [];
    this.columnsClausesJoin = [];
  }

  clause(databaseWhereClause: DatabaseWhereClause) {
    this.andClause([databaseWhereClause]);
  }

  andClause(databaseWhereClauses: DatabaseWhereClause[]) {
    this.columnsClauses.push(databaseWhereClauses);
    this.columnsClausesJoin.push(" AND ");
  }

  orClause(databaseWhereClauses: DatabaseWhereClause[]) {
    this.columnsClauses.push(databaseWhereClauses);
    this.columnsClausesJoin.push(" OR ");
  }

  convertFromModelToRepoColumns(matcherCallback: (i: number) => string | null) {
    if (this.orderColumn !== null) {
      this.orderColumn = matcherCallback(this.orderColumn as number);
    }

    this.columnsClauses.forEach(databaseWhereClauses => {
      databaseWhereClauses.forEach(databaseWhereClause => {
        databaseWhereClause.convertFromModelToRepoColumns(matcherCallback);
      });
    });
  }

  build() {
    const sql = [];
    let isWhereClauseExists = false;
    for (let i = this.columnsClauses.length; i-- > 0; ) {
      const databaseWhereClauses = this.columnsClauses[i];

      const sqlColumnClause = [];
      for (let j = databaseWhereClauses.length; j-- > 0; ) {
        const columnClause = databaseWhereClauses[j].build();
        sqlColumnClause.push(columnClause);
        isWhereClauseExists = true;
      }

      sql.push(`(${sqlColumnClause.join(this.columnsClausesJoin[i])})`);
    }

    let sqlColumns = sql.join(" AND ");
    if (isWhereClauseExists === true) {
      sqlColumns = `WHERE ${sqlColumns}`;
    }

    let sqlGroup = "";
    let sqlOrder = "";
    let sqlLimit = "";
    let sqlOffset = "";

    if (this.groupColumn !== null) {
      sqlGroup = `GROUP BY ${this.groupColumn}`;
    }

    if (this.orderColumn !== null) {
      sqlOrder = `ORDER BY ${this.orderColumn} ${this.orderType}`;
    }

    if (this.limit !== null) {
      sqlLimit = `LIMIT ${this.limit}`;
    }

    if (this.offset !== null) {
      sqlOffset = `OFFSET ${this.offset}`;
    }

    const sqlWhere =
      `${sqlColumns} ${sqlGroup} ${sqlOrder} ${sqlLimit} ${sqlOffset}`.trim();

    return sqlWhere.length === 0 ? "" : sqlWhere;
  }

  static makeRepoColumns(
    props: number[] | null,
    matcherCallback: (i: number) => string | null
  ) {
    let columns;

    if (props === null) {
      columns = ["*"];
    } else {
      columns = [];
      props.forEach(prop => {
        const column = matcherCallback(prop);
        if (column !== null) {
          columns.push(column);
        }
      });

      if (columns.length === 0) {
        throw new Error(
          "You must select at least one primitive property, because it is required in object construction"
        );
      }
    }

    return columns;
  }
}

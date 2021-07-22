import mysql from 'mysql';

export default class DatabaseWhereClause {

    column: string | number | null;
    sign: string;
    value: any;
    convertToRepoColumn: boolean;

    constructor(column: number, sign: string, value: any, convertToRepoColumn: boolean = true) {
        this.column = column;
        this.sign = sign;
        this.value = value;
        this.convertToRepoColumn = convertToRepoColumn;
    }

    convertFromModelToRepoColumns(matcherCallback: (i: number) => string | null) {
        if (this.convertToRepoColumn !== true) {
            return;
        }

        this.column = matcherCallback(this.column as number);
        this.convertToRepoColumn = false;
    }

    build(): string {
        let isNull = false;
        let sqlValues;

        if (this.value instanceof Array) {
            const count = this.value.length;
            if (count === 0) {
                return this.sign === '=' ? 'FALSE' : 'TRUE';
            }

            for (let i = count; i-- > 0;) {
                const value = this.value[i];
                if (value === null) {
                    isNull = true;
                }
                this.value[i] = `${mysql.escape(this.value[i])}`;
            }
            this.sign = this.sign === '=' ? 'IN' : 'NOT IN';
            sqlValues = `(${this.value.join(',')})`;
        } else {
            if (this.value === null) {
                isNull = true;
            }
            this.value = `${mysql.escape(this.value)}`;
            sqlValues = this.value;
        }

        let whereQuery = `${this.column} ${this.sign} ${sqlValues}`;
        if (isNull === true) {
            whereQuery = `(${whereQuery} OR ${this.column} IS NULL)`;
        }

        return whereQuery;
    }

}

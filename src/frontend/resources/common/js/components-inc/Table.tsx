// eslint-disable-next-line max-classes-per-file
import React from 'react';

import S from '../utilities/Main';

import TableDesktop, { TableDesktopProps } from './TableDesktop';
import TableMobile, { TableMobileProps } from './TableMobile';

import '../../css/components-inc/table.css';

interface Props extends TableDesktopProps, TableMobileProps {
}

export default class Table extends React.Component < Props > {

    static ROW_CLASS_NEW = 1;
    static ROW_CLASS_PROCESSING = 2;
    static ROW_CLASS_OVERDUE = 3;
    static ROW_CLASS_ERROR = 4;
    static ROW_CLASS_FINISHED = 5;

    static row(cells: TableCell[], rowClassNameName: string = S.Strings.EMPTY) {
        return new TableRow(cells, rowClassNameName);
    }

    static cell(content: any, sortValue: any = null) {
        if (sortValue === null) {
            sortValue = content;
        }

        return new TableCell(content, sortValue);
    }

    static cellString(content: string, className = S.Strings.EMPTY) {
        const cellNode = (
            <span className = { `Dots ${className}` } title = { content } > { content } </span>
        );

        return Table.cell(cellNode, content);
    }

    render() {
        return (
            <>
                <TableDesktop
                    className = { this.props.className }
                    widths = { this.props.widths }
                    legend = { this.props.legend }
                    aligns = { this.props.aligns }
                    helper = { this.props.helper }
                    onClickRow = { this.props.onClickRow }
                    rows = { this.props.rows }
                    showPaging = { this.props.showPaging }
                    contentScrollable = { this.props.contentScrollable } />
                <TableMobile
                    className = { this.props.className }
                    legend = { this.props.legend }
                    helper = { this.props.helper }
                    onClickRow = { this.props.onClickRow }
                    rows = { this.props.rows}
                    firstRowActionIndex = { this.props.firstRowActionIndex }
                    lastRowActionIndex = { this.props.lastRowActionIndex }
                    itemsSize = { this.props.itemsSize }
                    showPaging = { this.props.showPaging } />
            </>
        )
    }

}

interface TableBoolProps {
    className?: string;
    positiveLabel?: string;
    negativeLabel?: string;
    value: S.INT_TRUE | S.INT_FALSE;
}

export class TableBool extends React.Component < TableBoolProps > {

    static defaultProps: any;

    render() {
        return (
            <div className = { `TableBool ${this.props.className} ${S.CSS.getActiveClassName(this.props.value === S.INT_TRUE)}` } >
                { this.props.value === S.INT_TRUE ? this.props.positiveLabel : this.props.negativeLabel }
            </div>
        )
    }

}

TableBool.defaultProps = {
    'className': S.Strings.EMPTY,
    'positiveLabel': 'Yes',
    'negativeLabel': 'No',
}

export class TableRow {

    cells: TableCell[];
    rowClassName: string;

    constructor(cells: TableCell[], rowClassName: string = S.Strings.EMPTY) {
        this.cells = cells;
        this.rowClassName = rowClassName;
    }
}

export class TableCell {

    content: any;
    sortValue: any;

    constructor(content: any, sortValue: any) {
        this.content = content;
        this.sortValue = sortValue;
    }

}

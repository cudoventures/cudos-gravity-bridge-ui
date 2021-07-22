import React from 'react';
import PropTypes from 'prop-types';

import ArrowDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowUpIcon from '@material-ui/icons/ArrowDropUp';

import TableHelper from '../helpers/TableHelper';

import Paging from './Paging';
import Popover from './Popover';

import '../../css/components-inc/table-mobile.css';
import S from '../utilities/Main';
import Table, { TableRow } from './Table';

export interface TableMobileProps {
    className?: string;
    legend: string[];
    helper: TableHelper;
    rows: TableRow[];
    onClickRow?: (i: number) => void,
    firstRowActionIndex?: number,
    lastRowActionIndex?: number,
    itemsSize?: number,
    showPaging?: boolean,
}

interface State {
    sortDropDownOpened: boolean;
    sortDropDownAnchor: any;
}

export default class TableMobile extends React.Component < TableMobileProps, State > {

    static defaultProps: any;
    sState: State;

    constructor(props: TableMobileProps) {
        super(props);

        this.sState = {
            'sortDropDownOpened': false,
            'sortDropDownAnchor': null,
        }
    }

    onToggleSortDropDown = (e) => {
        this.sState.sortDropDownOpened = !this.sState.sortDropDownOpened;
        if (this.sState.sortDropDownOpened === true) {
            this.sState.sortDropDownAnchor = e.target;
        }
        this.setState(this.sState);
        e.stopPropagation();
    }

    onCloseSortDropDown = (e) => {
        this.sState.sortDropDownOpened = false;
        this.setState(this.sState);
        if (e !== undefined) {
            e.stopPropagation();
        }
    }

    onClickLegendCell(index: number) {
        const helper = this.props.helper;
        if (helper.isTableSortIndexClickable(index) === false) {
            return;
        }

        const sortKey = helper.getTableSortKey(index);
        if (Math.abs(helper.tableState.sortKey) === sortKey) {
            helper.updateTableSortDirection();
        } else {
            helper.updateTableSort(sortKey);
        }
    }

    onClickRow(rowIndex: number) {
        if (this.props.onClickRow !== null) {
            this.props.onClickRow(rowIndex);
        }
    }

    render() {
        return (
            <div className = { `Table TableMobile ${this.props.className}` } >
                { this.renderLegend() }
                { this.renderRows() }
                { this.props.showPaging === true && (
                    <Paging helper = { this.props.helper } />
                ) }
            </div>
        )
    }

    renderLegend() {
        const helper = this.props.helper
        const legend = this.props.legend;
        const tableSortIndex = helper.getTableSortIndex();
        const sortOptions = [];

        for (let i = 0; i < legend.length; ++i) {
            if (helper.isTableSortIndexClickable(i) === false) {
                continue;
            }

            sortOptions.push((
                <div key = { i } onClick = { this.onClickLegendCell.bind(this, i) } >
                    { legend[i] }
                </div>
            ));
        }

        return (
            <div className = { 'TableRow Legend' } >
                <div className = { 'TableCell' } >
                    <div> { legend[0] } </div>
                    <div onClick = { this.onToggleSortDropDown }>
                        { sortOptions.length > 0 && (
                            <>
                                { tableSortIndex === S.NOT_EXISTS && (
                                    'Sort by'
                                ) }
                                { tableSortIndex !== S.NOT_EXISTS && (
                                    <div className = { 'FlexRow' } >
                                        <div>
                                        orted by&nbsp;
                                            { legend[tableSortIndex] }
                                        </div>
                                        { this.renderSortArrow(tableSortIndex) }
                                    </div>
                                ) }
                                <Popover
                                    open = { this.sState.sortDropDownOpened }
                                    anchorEl = { this.sState.sortDropDownAnchor }
                                    onClose = { this.onCloseSortDropDown }
                                    anchorOrigin = { {
                                        vertical: 'bottom',
                                        horizontal: 'right',
                                    } } >

                                    <div className = { 'TableMobileHeaderSortOptions' } >
                                        { sortOptions }
                                    </div>

                                </Popover>
                            </>
                        ) }
                    </div>
                </div>
            </div>
        )
    }

    renderSortArrow(index: number) {
        const helper = this.props.helper;
        const sortIndex = helper.getTableSortIndex();
        if (sortIndex !== index) {
            return null;
        }

        return helper.tableState.sortKey > 0 ? <ArrowUpIcon/> : <ArrowDownIcon/>;
    }

    renderRows() {
        const rows = this.props.rows;
        if (rows.length === 0) {
            return (
                <div className = { 'Empty FlexSingleCenter' } > No results found </div>
            );
        }

        const itemsSize = this.props.itemsSize === S.NOT_EXISTS ? this.props.legend.length : this.props.itemsSize;
        const resultRows = [];

        for (let i = 0; i < rows.length; ++i) {
            const cells = rows[i].cells;
            
            const resultRow = [
                (
                    <div
                        key = { 0 }
                        className = { 'TableCell FlexRow' } >

                        <div> { cells[0].content } </div>
                        { this.props.firstRowActionIndex !== S.NOT_EXISTS && (
                            <div> { cells[this.props.firstRowActionIndex].content } </div>
                        )}

                    </div>
                ),
            ]

            for (let j = 1; j < itemsSize; ++j) {
                resultRow.push((
                    <div
                        key = { j }
                        className = { 'TableCell FlexRow' } >

                        <div> { this.props.legend[j] } </div>
                        <div> { cells[j].content } </div>

                    </div>
                ));
            }

            resultRows.push((
                <div key = { i } className = { `TableRow Transition ${rows[i].rowClassName} ` } onClick = { this.onClickRow.bind(this, i) } > { resultRow } </div>
            ));
        }

        return resultRows;
    }

}

TableMobile.defaultProps = {
    'className': S.Strings.EMPTY,
    'onClickRow': null,
    'firstRowActionIndex': S.NOT_EXISTS,
    'lastRowActionIndex': S.NOT_EXISTS,
    'itemsSize': S.NOT_EXISTS,
    'showPaging': true,
};

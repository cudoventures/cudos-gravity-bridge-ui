import React from 'react';

import S from '../utilities/Main';
import TableHelper from '../helpers/TableHelper';

import SvgArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import SvgArrowRight from '@material-ui/icons/KeyboardArrowRight';

import '../../css/components-inc/paging.css';

interface Props {
    helper: TableHelper;
}

export default class Paging extends React.Component < Props > {

    render() {
        const helper = this.props.helper;
        const tableState = helper.tableState;

        const pageOffset = 2;
        const cntPage = Number(tableState.from / tableState.itemsPerPage);
        const totalPages = Number(Math.floor((tableState.total + (tableState.itemsPerPage - 1)) / tableState.itemsPerPage));

        let startPage = cntPage - pageOffset;
        let endPage = cntPage + pageOffset + 1;
        if (startPage < 0) {
            startPage = 0;
        }
        if (endPage > totalPages) {
            endPage = totalPages;
        }

        if (totalPages <= 1) {
            return null;
        }

        const result = [];

        if (cntPage - 1 >= 0) {
            result.push(this.renderPageNode(-1, this.renderPreviousNode(), false, cntPage - 1));
        }

        if (cntPage - pageOffset - 1 >= 0) {
            result.push(this.renderPageNode(0, 1, false, 0));
            if (cntPage - pageOffset - 1 > 0) {
                result.push(this.renderPageNode(-2, '...', false, S.NOT_EXISTS));
            }
        }

        for (let i = startPage; i < endPage; ++i) {
            if (i === cntPage) {
                result.push(this.renderPageNode(-3, i + 1, true, S.NOT_EXISTS));
            } else {
                result.push(this.renderPageNode(i, i + 1, false, i));
            }
        }

        if (cntPage + pageOffset + 1 < totalPages) {
            if (cntPage + pageOffset + 1 < totalPages - 1) {
                result.push(this.renderPageNode(-4, '...', false, S.NOT_EXISTS));
            }
            result.push(this.renderPageNode(totalPages - 1, totalPages, false, totalPages - 1));
        }

        if (cntPage + 1 < totalPages) {
            result.push(this.renderPageNode(-5, this.renderNextNode(), false, cntPage + 1));
        }

        return (
            <div className = { 'Paging' } > { result } </div>
        );
    }

    renderPreviousNode() {
        return (
            <div className = { 'SVG Size IconArrow' } ><SvgArrowLeft /></div>
        )
    }

    renderNextNode() {
        return (
            <div className = { 'SVG Size IconArrow' } ><SvgArrowRight /></div>
        )
    }

    renderPageNode(key: number, text: string | React.ReactNode | number, active: boolean, page: number) {
        const onClickHandler = page === S.NOT_EXISTS ? undefined : () => {
            const helper = this.props.helper;
            helper.updateTablePage(page * this.props.helper.tableState.itemsPerPage);
        };

        return (
            <div
                key = { key }
                className = { `FlexSingleCenter ${S.CSS.getClassName(onClickHandler !== null, 'Clickable')} ${S.CSS.getActiveClassName(active)}` }
                onClick = { onClickHandler } >

                { text }

            </div>
        );
    }

}

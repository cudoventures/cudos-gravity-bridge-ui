import React from 'react';
import { inject, observer } from 'mobx-react';

import Config from '../../../../../../builds/dev-generated/Config';
import PopupTransactionsHistoryStore from '../../../common/js/stores/PopupTransactionsHistoryStore';
import TableHelper from '../../../common/js/helpers/TableHelper';
import S from '../../../common/js/utilities/Main';
import TransactionHistoryModel, { TxStatus } from '../../../common/js/models/TransactionHistoryModel';

import PopupWindow, { PopupWindowProps } from '../../../common/js/components-core/PopupWindow';
import LoadingIndicator from '../../../common/js/components-core/LoadingIndicator';
import Table from '../../../common/js/components-inc/Table';
import TableDesktop from '../../../common/js/components-inc/TableDesktop';

import SvgClose from '../../../common/img/favicon/close-icon-24x24.svg'
import SvgCudosLogo from '../../../common/img/favicon/cudos-22x22.svg'
import SvgEthLogo from '../../../common/img/favicon/eth-16x25.svg'
import SvgTransferLogoAlt from '../../../common/img/favicon/transfer-logo-alt.svg'
import '../../css/components-popups/transactions-history-popup.css';
import AlertStore from '../../../common/js/stores/AlertStore';

interface Props extends PopupWindowProps {
    popupStore?: PopupTransactionsHistoryStore;
    alertStore?: AlertStore;
}

const ETHERSCAN_EXPLORER = Config.CUDOS_NETWORK.NETWORK_TYPE === 'mainnet'
    ? Config.ETHEREUM.ETHERSCAN_MAINNET
    : Config.ETHEREUM.ETHERSCAN_SEPOLIA
const CUDOS_EXPLORER = Config.CUDOS_NETWORK.BLOCK_EXPLORER;

class TransactionsHistoryPopup extends PopupWindow < Props > {

    tableHelper: TableHelper;

    constructor(props) {
        super(props);

        this.tableHelper = new TableHelper(S.NOT_EXISTS, [], () => {}, Number.MAX_SAFE_INTEGER);
    }

    getCssClassName() {
        return 'TransactionsHistoryPopup PopupPadding PopupBox';
    }

    onClickCancelSendToEth(transactionHistoryModel: TransactionHistoryModel) {
        const alertStore = this.props.alertStore;
        alertStore.hide();
        alertStore.title = 'Do you want to Decline?';
        alertStore.subtitle = 'Are you sure you want to decline the transaction? This action cannot be reversed.';
        alertStore.positiveLabel = 'Yes, Decline';
        alertStore.negativeLabel = 'No, Go Back';
        alertStore.positiveListener = () => {
            const callback = this.props.popupStore.onClickCancelSendToEnd
            this.props.popupStore.hide();
            callback(transactionHistoryModel);
            return true;
        }
        alertStore.visible = true;
    }

    renderContent() {
        const popupStore = this.props.popupStore;

        return (
            <div className = { 'PopupWindowContent LargeContent' } >
                { popupStore.transactions ? (
                    <>
                        <div className = { 'PopupTitleRow' } >
                            <div className = { 'PopupTitle' }>Transactions History</div>
                            <div className = { 'PopupSubtitle' }>Only transactions included in blocks from {popupStore.lastKnownBatchHeight} to {popupStore.lastKnownBatchHeight + 119} can be canceled.</div>
                        </div>
                        <Table
                            className = { 'TransactionsTable' }
                            widths = { ['20px', '25%', '25%', '20%', '15%', '15%'] }
                            aligns = { [TableDesktop.ALIGN_LEFT, TableDesktop.ALIGN_LEFT, TableDesktop.ALIGN_LEFT, TableDesktop.ALIGN_LEFT, TableDesktop.ALIGN_LEFT, TableDesktop.ALIGN_RIGHT] }
                            legend ={ ['#', 'Direction', 'Amount', 'Transaction Hash', 'Time', 'Status'] }
                            helper = { this.tableHelper }
                            rows = { this.renderRows() } />
                    </>
                ) : (
                    <LoadingIndicator margin = { 'auto' } />
                ) }
            </div>
        )
    }

    renderRows() {
        const popupStore = this.props.popupStore;
        const directions = [
            <>
                <div className = { 'SVG SvgCurrency' } dangerouslySetInnerHTML = {{ __html: SvgCudosLogo }} />
                CUDOS
            </>,
            <>
                <div className = { 'SVG SvgCurrency' } dangerouslySetInnerHTML = {{ __html: SvgEthLogo }} />
                Ethereum
            </>,
        ]

        return popupStore.transactions.map((transactionHistoryModel: TransactionHistoryModel, i: number) => {
            const directionsCache = [...directions];
            let explorerLink, statusLabel;

            if (transactionHistoryModel.isFromEth() === true) {
                directionsCache.reverse();
                explorerLink = <a className = { 'ColorSecondary Dots' } href={`${ETHERSCAN_EXPLORER}/${transactionHistoryModel.txHash}`} rel='noreferrer' target='_blank'>{transactionHistoryModel.txHash}</a>
            } else {
                explorerLink = <a className = { 'ColorSecondary Dots' } href={`${CUDOS_EXPLORER}/${transactionHistoryModel.txHash}`} rel='noreferrer' target='_blank'>{transactionHistoryModel.txHash}</a>
            }

            switch (transactionHistoryModel.txStatus) {
                case TxStatus.TYPE_PENDING:
                    statusLabel = <div className = { 'TxStatus TxStatusPending' }>Pending</div>
                    break;
                case TxStatus.TYPE_ERROR:
                    statusLabel = <div className = { 'TxStatus TxStatusError' }>Declined</div>
                    break;
                case TxStatus.TYPE_SUCCESS:
                default:
                    statusLabel = (
                        <>
                            <div className = { 'TxStatus TxStatusSuccess' }>Success</div>
                            {/* { transactionHistoryModel.isCancelable(popupStore.lastKnownBatchHeight) === true && ( */}
                            <div
                                className = { 'SVG SvgIconClose' }
                                onClick = { this.onClickCancelSendToEth.bind(this, transactionHistoryModel) }
                                dangerouslySetInnerHTML = {{ __html: SvgClose }} />
                            {/* ) } */}
                        </>
                    )
                    break;
            }

            return Table.row([
                Table.cellString((i + 1).toString()),
                Table.cell(
                    <div className = { 'Destination FlexRow' } >
                        { directionsCache[0] }
                        <div className = { 'SVG SvgArrows' } dangerouslySetInnerHTML = {{ __html: SvgTransferLogoAlt }} />
                        { directionsCache[1] }
                    </div>,
                ),
                Table.cellString(transactionHistoryModel.formatAmountInCudos()),
                Table.cell(explorerLink),
                Table.cellString(transactionHistoryModel.formatTimestamp()),
                Table.cell(statusLabel),
            ]);
        });
    }

}

export default inject((stores) => {
    return {
        alertStore: stores.alertStore,
        popupStore: stores.popupTransactionsHistoryStore,
    }
})(observer(TransactionsHistoryPopup));

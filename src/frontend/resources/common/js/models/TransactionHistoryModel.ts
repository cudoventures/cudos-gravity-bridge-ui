import { makeAutoObservable, runInAction } from 'mobx';
import Long from 'long';
import BigNumber from 'bignumber.js';
import moment from 'moment';
import { CudosNetworkConsts, IndexedTx, StargateClient, decodeTxRaw } from 'cudosjs';

import { formatCudos } from '../helpers/NumberFormatter';
import S from '../utilities/Main';
import { MsgSendToEth } from 'cudosjs/build/stargate/modules/gravity/proto-types/msgs';
import ProjectUtils from '../ProjectUtils';

export enum TxType {
    TYPE_CUDOS_ETH = 1,
    TYPE_ETH_CUDOS = 2,
}

export enum TxStatus {
    TYPE_PENDING = 1,
    TYPE_SUCCESS = 2,
    TYPE_ERROR = 3,
}

export default class TransactionHistoryModel {

    txType: TxType;
    txId: Long;
    txHash: string;
    amountInAcudos: BigNumber;
    timestamp: number;
    txStatus: TxStatus;
    height: number;

    constructor() {
        this.txType = TxType.TYPE_CUDOS_ETH;
        this.txId = Long.fromNumber(0);
        this.txHash = '';
        this.amountInAcudos = new BigNumber(0);
        this.timestamp = 0;
        this.txStatus = TxStatus.TYPE_PENDING;
        this.height = 0;

        makeAutoObservable(this);
    }

    static fromCudosTx(indexTx: IndexedTx, canceledTxIds: Set < string >): TransactionHistoryModel {
        const model = new TransactionHistoryModel();
        const rawTx = decodeTxRaw(indexTx.tx);
        const msgSendToEth = MsgSendToEth.decode(rawTx.body.messages[0].value);

        model.txType = TxType.TYPE_CUDOS_ETH;
        model.txHash = indexTx.hash;

        model.amountInAcudos = new BigNumber(msgSendToEth.amount.amount);
        model.amountInAcudos = model.amountInAcudos.plus(new BigNumber(msgSendToEth.bridgeFee.amount));

        for (let i = indexTx.events.length; i-- > 0;) {
            const event = indexTx.events[i];
            if (event.type === 'message') {
                for (let j = event.attributes.length; j-- > 0;) {
                    const attribute = event.attributes[j];
                    if (attribute.key === 'outgoing_tx_id') {
                        model.txId = Long.fromString(attribute.value);
                        break;
                    }
                }
            }

            if (model.txId.toNumber() !== 0) {
                break;
            }
        }

        if (canceledTxIds.has(model.txId.toString())) {
            model.txStatus = TxStatus.TYPE_ERROR;
        }

        return model;
    }

    static fromEthereumEvent(event): TransactionHistoryModel {
        const model = new TransactionHistoryModel();

        model.txType = TxType.TYPE_ETH_CUDOS;
        model.txHash = event.blockHash;
        model.height = event.blockNumber;
        model.amountInAcudos = new BigNumber(event.returnValues._amount);
        model.txStatus = TxStatus.TYPE_SUCCESS;

        return model;
    }

    hasTimestamp(): boolean {
        return this.timestamp !== 0;
    }

    isFromCudos(): boolean {
        return this.txType === TxType.TYPE_CUDOS_ETH;
    }

    isFromEth(): boolean {
        return this.txType === TxType.TYPE_ETH_CUDOS;
    }

    isBatched(lastKnownBatchHeight: number) {
        return this.height <= lastKnownBatchHeight;
    }

    isCancelable(lastKnownBatchHeight: number) {
        return this.isFromCudos() === true && this.isBatched(lastKnownBatchHeight) === false && this.txId.low > 0;
    }

    formatAmountInCudos(): string {
        return `${formatCudos(this.amountInAcudos.dividedBy(CudosNetworkConsts.CURRENCY_1_CUDO), true, 18)}`
    }

    formatTimestamp(): string {
        return this.hasTimestamp() === true ? moment(new Date(this.timestamp)).format(S.MOMENT_FORMAT_DATE_AND_TIME) : '';
    }

    async loadCudosInfo(client: StargateClient) {
        const rawTxBytes = await client.getTx(this.txHash);
        const rawTx = await client.decodeQryResponse(rawTxBytes);

        const height = parseInt(rawTx.height);
        if (Number.isNaN(height) === true) {
            // leave this tx as pending
            return;
        }

        const block = await client.getBlock(height);

        await ProjectUtils.runInActionAsync(() => {
            this.height = rawTx.height;
            this.timestamp = new Date(block.header.time).getTime();
            if (this.txStatus === TxStatus.TYPE_PENDING) {
                this.txStatus = rawTx.code === 0 ? TxStatus.TYPE_SUCCESS : TxStatus.TYPE_ERROR;
            }
        });
    }

    async loadEthInfo() {
        const block = await window.web3.eth.getBlock(this.height);
        this.timestamp = block.timestamp * 1000;
    }

}

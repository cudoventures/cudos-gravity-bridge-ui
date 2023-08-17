import { action, makeObservable, observable, runInAction } from 'mobx';
import PopupStore from './PopupStore';
import KeplrLedger from '../models/ledgers/KeplrLedger';
import MetamaskLedger from '../models/ledgers/MetamaskLedger';
import TransactionHistoryModel from '../models/TransactionHistoryModel';
import ProjectUtils from '../ProjectUtils';

export default class PopupTransactionsHistoryStore extends PopupStore {

    @observable keplrLedger: KeplrLedger = null;
    @observable metamaskLedger: MetamaskLedger = null;
    @observable transactions: TransactionHistoryModel[] = null;
    @observable lastKnownBatchHeight: number = 0;
    @observable onClickCancelSendToEnd: (tx: TransactionHistoryModel) => void = null;

    requestId: number = 0;

    constructor() {
        super();
        makeObservable(this);
    }

    @action
    async showSignal(keplrLedger: KeplrLedger, metamaskLedger: MetamaskLedger, onClickCancelSendToEnd: (tx: TransactionHistoryModel) => void) {
        this.keplrLedger = keplrLedger;
        this.metamaskLedger = metamaskLedger;
        this.onClickCancelSendToEnd = onClickCancelSendToEnd;
        this.visible = true;

        const requestId = ++this.requestId;
        const stargateClient = await keplrLedger.getKeplrClient();

        const cudosNetworkHeight = await stargateClient.getHeight();
        await ProjectUtils.runInActionAsync(() => {
            this.lastKnownBatchHeight = Math.floor(cudosNetworkHeight / 120) * 120;
        });

        const cudosTransactionsPromise = keplrLedger.fetchHistoryTransactions(this.lastKnownBatchHeight);
        // const ethTransactionsPromise = metamaskLedger.fetchHistoryTransactions();

        // const [cudosTransactions, ethTransactions] = await Promise.all([cudosTransactionsPromise, ethTransactionsPromise]);
        const [cudosTransactions] = await Promise.all([cudosTransactionsPromise]);
        if (requestId !== this.requestId) {
            return
        }

        await ProjectUtils.runInActionAsync(() => {
            // this.transactions = cudosTransactions.concat(ethTransactions);
            this.transactions = cudosTransactions;
        });

        for (let i = 0; i < this.transactions.length && requestId === this.requestId; ++i) {
            if (this.transactions[i].isFromCudos() === true) {
                await this.transactions[i].loadCudosInfo(stargateClient);
            } else {
                await this.transactions[i].loadEthInfo();
            }

            await ProjectUtils.runInActionAsync(() => {
                this.transactions.sort((tx1, tx2) => {
                    return tx2.timestamp - tx1.timestamp;
                });
            });
        }

        runInAction(() => {

        });
    }

    hide = action(() => {
        this.visible = false; // super.hide is not a function
        this.keplrLedger = null;
        this.metamaskLedger = null;
        this.transactions = null;
        this.onClickCancelSendToEnd = null;
        ++this.requestId; // force stop pending queries
    })

}

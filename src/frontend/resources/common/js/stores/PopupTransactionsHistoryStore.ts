import { action, makeObservable, observable, runInAction } from 'mobx';
import PopupStore from './PopupStore';
import KeplrLedger from '../models/ledgers/KeplrLedger';
import MetamaskLedger from '../models/ledgers/MetamaskLedger';
import TransactionHistoryModel from '../models/TransactionHistoryModel';

export default class PopupTransactionsHistoryStore extends PopupStore {

    @observable keplrLedger: KeplrLedger = null;
    @observable metamaskLedger: MetamaskLedger = null;
    @observable transactions: TransactionHistoryModel[] = null;
    @observable lastKnownBatchHeight: number = 0;

    requestId: number = 0;

    constructor() {
        super();
        makeObservable(this);
    }

    @action
    async showSignal(keplrLedger: KeplrLedger, metamaskLedger: MetamaskLedger) {
        this.keplrLedger = keplrLedger;
        this.metamaskLedger = metamaskLedger;
        this.visible = true;

        const requestId = ++this.requestId;
        const stargateClient = await keplrLedger.getKeplrClient();
        const cudosTransactionsPromise = keplrLedger.fetchHistoryTransactions();
        const ethTransactionsPromise = metamaskLedger.fetchHistoryTransactions();

        const networkHeight = await stargateClient.getHeight();
        this.lastKnownBatchHeight = Math.floor(networkHeight / 120) * 120;

        const [cudosTransactions, ethTransactions] = await Promise.all([cudosTransactionsPromise, ethTransactionsPromise]);
        if (requestId !== this.requestId) {
            return
        }

        runInAction(async () => {
            this.transactions = cudosTransactions.concat(ethTransactions);

            for (let i = 0; i < this.transactions.length && requestId === this.requestId; ++i) {
                if (this.transactions[i].isFromCudos() === true) {
                    await this.transactions[i].loadCudosInfo(stargateClient);
                } else {
                    await this.transactions[i].loadEthInfo();
                }

                this.transactions.sort((tx1, tx2) => {
                    return tx2.timestamp - tx1.timestamp;
                });
            }
        });
    }

    hide = () => {
        runInAction(() => {
            super.hide();
            this.keplrLedger = null;
            this.metamaskLedger = null;
            this.transactions = null;
            ++this.requestId; // force stop pending queries
        });
    }

}

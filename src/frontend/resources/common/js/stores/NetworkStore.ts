import { makeObservable, observable } from 'mobx';

import MetamaskLedger from '../../../common/js/models/ledgers/MetamaskLedger';
import KeplrLedger from '../../../common/js/models/ledgers/KeplrLedger';
import Ledger from '../../../common/js/models/ledgers/Ledger';

class NetworkHandler {
    name: string;
    ledger: Ledger;

    constructor(name: string, ledger: Ledger) {
        this.name = name;
        this.ledger = ledger;
    }

}

export default class NetworkStore {

    @observable networkHolders = [
        new NetworkHandler(MetamaskLedger.NETWORK_NAME, new MetamaskLedger()),
        new NetworkHandler(KeplrLedger.NETWORK_NAME, new KeplrLedger()),
    ];

    constructor() {
        makeObservable(this);
    }

}

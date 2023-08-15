import { makeObservable, observable } from 'mobx';

import MetamaskLedger from '../../../common/js/models/ledgers/MetamaskLedger';
import KeplrLedger from '../../../common/js/models/ledgers/KeplrLedger';
import Ledger from '../../../common/js/models/ledgers/Ledger';

import { Ledger as CudosJsLedger } from 'cudosjs';

type GravityBridgeUiLedger = Ledger & CudosJsLedger;

class NetworkHandler {
    name: string;
    ledger: GravityBridgeUiLedger;

    constructor(name: string, ledger: GravityBridgeUiLedger) {
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


import Ledger from './Ledger';
import { makeObservable, observable } from 'mobx';

export default class KeplrLedger implements Ledger {
    @observable connected: boolean;

    constructor(){
        this.connected = false;
        makeObservable(this);
    }

    connect(): boolean {
        return true;
    }

    disconnect(): void {
        
    }

    send(amount: number, destiantionAddress: string) {
        
    }
}
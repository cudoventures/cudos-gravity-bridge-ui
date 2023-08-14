import BigNumber from 'bignumber.js';

export default interface Ledger {

    getWalletError(): string;
    getTxHash(): string;
    isAddressValid(address: string): boolean;
    getAccountAddress(): string;
    send(amount: BigNumber, destiantionAddress: string): Promise<void>;

}

import BigNumber from 'bignumber.js';

export default interface Ledger {
    connected: number,
    account: string,
    walletError: string,
    txHash: string,
    connect: () => Promise<void>,
    disconnect: () => Promise<void>,
    send: (amount: BigNumber, destination: string) => Promise<void>,
    requestBatch: () => Promise < void >;
    isAddressValid: (address: string) => boolean,
    getBalance(): Promise<BigNumber>,
}

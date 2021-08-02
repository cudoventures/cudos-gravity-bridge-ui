import BigNumber from 'bignumber.js';

export default interface Ledger {
    connected: number,
    connect: (onSuccess: Function, onError: Function) => Promise<void>,
    disconnect: () => Promise<void>,
    send: (amount: BigNumber, destination: string, onSuccess: Function, onError: Function) => Promise<void>,
    isAddressValid: (address: string) => boolean,
    getBalance(onError: Function): Promise<BigNumber>,
}

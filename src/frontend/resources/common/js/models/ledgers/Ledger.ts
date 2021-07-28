export default interface Ledger {
    connected: number,
    connect: () => Promise<void>,
    disconnect: () => Promise<void>,
    send: (amount: number, destination: string) => Promise<void>,
    isAddressValid: (address: string) => boolean,
    getBalance(): Promise<number>,
}

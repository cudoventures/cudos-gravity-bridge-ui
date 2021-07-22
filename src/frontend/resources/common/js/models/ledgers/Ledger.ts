export default interface Ledger {
    connected: number,
    connect: () => boolean,
    disconnect: () => void,
    send: (amount: number, destination: string) => void,
}
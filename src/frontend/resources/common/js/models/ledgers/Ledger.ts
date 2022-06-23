import { Coin, GasPrice } from '@cosmjs/launchpad';
import { EncodeObject } from '@cosmjs/proto-signing';
import { SigningStargateClient } from '@cosmjs/stargate';
import BigNumber from 'bignumber.js';

export default interface Ledger {
    connected: number,
    account: string,
    walletError: string,
    txHash: string,
    txNonce: Number,
    connect: () => Promise<void>,
    disconnect: () => Promise<void>,
    send: (amount: BigNumber, destination: string) => Promise<void>,
    EstimateFee: (client: SigningStargateClient, gasPrice: GasPrice, signerAddress: string, messages: readonly EncodeObject[], memo: string) => Promise<{
        amount: Coin[];
        gas: string;
    }>,
    GetKeplrClientAndAccount: () => Promise<any[]>,
    requestBatch: () => Promise < void >,
    isAddressValid: (address: string) => boolean,
    getBalance(): Promise<BigNumber>,
}

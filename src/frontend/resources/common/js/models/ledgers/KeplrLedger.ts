import Ledger from './Ledger';
import { action, makeObservable, observable } from 'mobx';
import Config from '../../../../../../../builds/dev-generated/Config';
import { Coin, coin, StargateClient, CudosNetworkConsts, StdFee, SigningStargateClient, assertIsDeliverTxSuccess, checkValidAddress, estimateFee, EncodeObject, GasPrice, KeplrWallet } from 'cudosjs';
import BigNumber from 'bignumber.js';

export default class KeplrLedger extends KeplrWallet implements Ledger {

    walletError: string;
    txHash: string;
    bridgeFee: BigNumber;
    queryClient: StargateClient

    static NETWORK_NAME = 'Cudos';

    constructor() {
        super({
            CHAIN_ID: Config.CUDOS_NETWORK.CHAIN_ID,
            CHAIN_NAME: Config.CUDOS_NETWORK.CHAIN_NAME,
            RPC: Config.CUDOS_NETWORK.RPC,
            API: Config.CUDOS_NETWORK.API,
            STAKING: Config.CUDOS_NETWORK.STAKING,
            GAS_PRICE: Config.CUDOS_NETWORK.GAS_PRICE,
        });

        this.connected = false;
        this.walletError = null;
        this.txHash = null;

        makeObservable(this, {
            'connected': observable,
            'accountAddress': observable,
            'connect': action,
            'walletError': observable,
            'txHash': observable,
            'bridgeFee': observable,
        });
    }

    async getKeplrClient(): Promise < StargateClient > {
        return StargateClient.connect(this.keplrWalletConfig.RPC);
    }

    async getKeplrSigningClient(): Promise < SigningStargateClient > {
        return SigningStargateClient.connectWithSigner(this.keplrWalletConfig.RPC, this.offlineSigner);
    }

    async send(amount: BigNumber, destinationAddress: string): Promise<void> {
        await window.keplr.enable(this.keplrWalletConfig.CHAIN_ID);
        const client = await this.getKeplrSigningClient();

        this.walletError = null;
        try {
            const coinAmount:Coin = coin(
                amount.multipliedBy(CudosNetworkConsts.CURRENCY_1_CUDO).toString(10),
                CudosNetworkConsts.CURRENCY_DENOM,
            )
            const bridgeFeeAmount:Coin = coin(
                this.bridgeFee.toString(10),
                CudosNetworkConsts.CURRENCY_DENOM,
            )
            const gasPrice:GasPrice = GasPrice.fromString(`${Config.CUDOS_NETWORK.GAS_PRICE}acudos`)

            const result = await client.gravitySendToEth(
                this.accountAddress,
                destinationAddress,
                coinAmount,
                bridgeFeeAmount,
                gasPrice,
                'Sent with CUDOS Bridge',
            );

            this.txHash = result.transactionHash;
            assertIsDeliverTxSuccess(result);
        } catch (e) {
            console.log(e);
            throw new Error(this.walletError = 'Failed to send transaction!');
        }
    }
  
    async cancelSend(transactionId: Long): Promise<void> {
        const proposalTypePath = '/gravity.v1.MsgCancelSendToEth'

        const chainId = Config.CUDOS_NETWORK.CHAIN_ID;
        await window.keplr.enable(chainId);
        const offlineSigner = window.getOfflineSigner(chainId);

        const account = (await offlineSigner.getAccounts())[0];

        const msgSend = [{
            typeUrl: proposalTypePath,
            value: {
                transactionId: Long.fromNumber(1),
                sender: account.address,
            },
        }];

        const msgFee = {
            amount: [{
                denom: CosmosNetworkH.CURRENCY_DENOM,
                amount: Config.CUDOS_NETWORK.FEE,
            }],
            gas: Config.CUDOS_NETWORK.GAS,
        }

        try {
            this.walletError = null;
            const myRegistry = new Registry([
                ...defaultRegistryTypes,
                [proposalTypePath, MsgCancelSendToEth],
            ])

            const rpcEndpoint = Config.CUDOS_NETWORK.RPC;
            const client = await SigningStargateClient.connectWithSigner(rpcEndpoint, offlineSigner, {
                registry: myRegistry,
            });

            const result = await client.signAndBroadcast(
                account.address,
                msgSend,
                msgFee,
            );

            this.txHash = result.transactionHash

            assertIsBroadcastTxSuccess(result);
        } catch (e) {
            console.log(e);
            throw new Error(this.walletError = 'Failed to send transaction!');
        }
    }

    async estimateFee(client: SigningStargateClient, sender: string, messages: EncodeObject[], gasPrice: GasPrice,
        memo?:string, gasMultiplier?: number):Promise<StdFee> {
        const fee = await estimateFee(client, sender, messages, gasPrice, gasMultiplier, memo)
        return fee
    }

    async getBalance(): Promise<BigNumber> {
        this.walletError = null;
        try {
            return super.getBalance();
        } catch (e) {
            this.walletError = 'Failed to get balance!'
        }

        return new BigNumber(0);
    }

    setBridgeFee(bridgeFee: BigNumber) {
        if (bridgeFee.lt((new BigNumber(1)).dividedBy(CudosNetworkConsts.CURRENCY_1_CUDO))) {
            return;
        }

        this.bridgeFee = bridgeFee;
    }

    isAddressValid(address: string): boolean {
        try {
            checkValidAddress(address)
            return true
        } catch {
            this.walletError = 'Invalid Cosmos Address'
            return false
        }
    }

    getWalletError(): string {
        return this.walletError;
    }

    getTxHash(): string {
        return this.txHash;
    }

    getAccountAddress(): string {
        return this.accountAddress;
    }
}

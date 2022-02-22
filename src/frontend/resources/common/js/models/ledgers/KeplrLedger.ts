import Ledger from './Ledger';
import { makeObservable, observable } from 'mobx';
import S from '../../utilities/Main';
import Config from '../../../../../../../builds/dev-generated/Config';
import CosmosNetworkH from './CosmosNetworkH';
import { MsgSendToEth, MsgRequestBatch } from '../../cosmos/codec/gravity/gravity/v1/msgs';
import { assertIsBroadcastTxSuccess, SigningStargateClient, defaultRegistryTypes } from '@cosmjs/stargate';
import { Registry } from '@cosmjs/proto-signing';
import BigNumber from 'bignumber.js';

export default class KeplrLedger implements Ledger {
    @observable connected: number;
    @observable account: string;
    @observable walletError: string;
    @observable txHash: string;

    static NETWORK_NAME = 'Cudos';
    private BRIDGE_FEE = (new BigNumber(1)).dividedBy(CosmosNetworkH.CURRENCY_1_CUDO);

    constructor() {
        this.connected = S.INT_FALSE;
        this.account = null;
        this.walletError = null;
        this.txHash = null;
        makeObservable(this);
    }

    async connect(): Promise<void> {
        this.walletError = null;
        try {
            await window.keplr.experimentalSuggestChain({
                // Chain-id of the Cosmos SDK chain.
                chainId: Config.CUDOS_NETWORK.CHAIN_ID,
                // The name of the chain to be displayed to the user.
                chainName: Config.CUDOS_NETWORK.CHAIN_NAME,
                // RPC endpoint of the chain.
                rpc: Config.CUDOS_NETWORK.RPC,
                // REST endpoint of the chain.
                rest: Config.CUDOS_NETWORK.API,
                // Staking coin information
                stakeCurrency: {
                    // Coin denomination to be displayed to the user.
                    coinDenom: CosmosNetworkH.CURRENCY_DISPLAY_NAME,
                    // Actual denom (i.e. uatom, uscrt) used by the blockchain.
                    coinMinimalDenom: CosmosNetworkH.CURRENCY_DENOM,
                    // # of decimal points to convert minimal denomination to user-facing denomination.
                    coinDecimals: CosmosNetworkH.CURRENCY_DECIMALS,
                    // (Optional) Keplr can show the fiat value of the coin if a coingecko id is provided.
                    // You can get id from https://api.coingecko.com/api/v3/coins/list if it is listed.
                    coinGeckoId: CosmosNetworkH.CURRENCY_COINGECKO_ID,
                },
                // (Optional) If you have a wallet webpage used to stake the coin then provide the url to the website in `walletUrlForStaking`.
                // The 'stake' button in Keplr extension will link to the webpage.
                walletUrlForStaking: Config.CUDOS_NETWORK.STAKING,
                // The BIP44 path.
                bip44: {
                    // You can only set the coin type of BIP44.
                    // 'Purpose' is fixed to 44.
                    coinType: CosmosNetworkH.LEDGER_COIN_TYPE,
                },
                bech32Config: {
                    bech32PrefixAccAddr: CosmosNetworkH.BECH32_PREFIX_ACC_ADDR,
                    bech32PrefixAccPub: CosmosNetworkH.BECH32_PREFIX_ACC_PUB,
                    bech32PrefixValAddr: CosmosNetworkH.BECH32_PREFIX_VAL_ADDR,
                    bech32PrefixValPub: CosmosNetworkH.BECH32_PREFIX_VAL_PUB,
                    bech32PrefixConsAddr: CosmosNetworkH.BECH32_PREFIX_CONS_ADDR,
                    bech32PrefixConsPub: CosmosNetworkH.BECH32_PREFIX_CONS_PUB,
                },
                // List of all coin/tokens used in this chain.
                currencies: [{
                    // Coin denomination to be displayed to the user.
                    coinDenom: CosmosNetworkH.CURRENCY_DISPLAY_NAME,
                    // Actual denom (i.e. uatom, uscrt) used by the blockchain.
                    coinMinimalDenom: CosmosNetworkH.CURRENCY_DENOM,
                    // # of decimal points to convert minimal denomination to user-facing denomination.
                    coinDecimals: CosmosNetworkH.CURRENCY_DECIMALS,
                    // (Optional) Keplr can show the fiat value of the coin if a coingecko id is provided.
                    // You can get id from https://api.coingecko.com/api/v3/coins/list if it is listed.
                    coinGeckoId: CosmosNetworkH.CURRENCY_COINGECKO_ID,
                }],
                // List of coin/tokens used as a fee token in this chain.
                feeCurrencies: [{
                    // Coin denomination to be displayed to the user.
                    coinDenom: CosmosNetworkH.CURRENCY_DISPLAY_NAME,
                    // Actual denom (i.e. uatom, uscrt) used by the blockchain.
                    coinMinimalDenom: CosmosNetworkH.CURRENCY_DENOM,
                    // # of decimal points to convert minimal denomination to user-facing denomination.
                    coinDecimals: CosmosNetworkH.CURRENCY_DECIMALS,
                    // (Optional) Keplr can show the fiat value of the coin if a coingecko id is provided.
                    // You can get id from https://api.coingecko.com/api/v3/coins/list if it is listed.
                    // coinGeckoId: Meteor.settings.public.coingeckoId,
                }],
                // (Optional) The number of the coin type.
                // This field is only used to fetch the address from ENS.
                // Ideally, it is recommended to be the same with BIP44 path's coin type.
                // However, some early chains may choose to use the Cosmos Hub BIP44 path of '118'.
                // So, this is separated to support such chains.
                coinType: CosmosNetworkH.LEDGER_COIN_TYPE,
                // (Optional) This is used to set the fee of the transaction.
                // If this field is not provided, Keplr extension will set the default gas price as (low: 0.01, average: 0.025, high: 0.04).
                // Currently, Keplr doesn't support dynamic calculation of the gas prices based on on-chain data.
                // Make sure that the gas prices are higher than the minimum gas prices accepted by chain validators and RPC/REST endpoint.
                gasPriceStep: {
                    low: Number(Config.CUDOS_NETWORK.GAS_PRICE) / 2,
                    average: Number(Config.CUDOS_NETWORK.GAS_PRICE) / 8,
                    high: Number(Config.CUDOS_NETWORK.GAS_PRICE) * 2,
                },
            });
        } catch (ex) {
            console.log(ex);
            this.walletError = 'Failed to suggest the chain'
        }

        // You should request Keplr to enable the wallet.
        // This method will ask the user whether or not to allow access if they haven't visited this website.
        // Also, it will request user to unlock the wallet if the wallet is locked.
        // If you don't request enabling before usage, there is no guarantee that other methods will work.
        try {
            await window.keplr.enable(Config.CUDOS_NETWORK.CHAIN_ID);

            const offlineSigner = window.getOfflineSigner(Config.CUDOS_NETWORK.CHAIN_ID);
            this.account = (await offlineSigner.getAccounts())[0].address;

            this.connected = S.INT_TRUE;
        } catch (error) {
            if (!window.keplr) {
                this.walletError = 'Keplr wallet not found! Please install to continue!';
            } else {
                this.walletError = 'Failed to connect to Keplr!'
            }
        }

    }

    async disconnect(): Promise<void> {
        return new Promise < void >((resolve, reject) => {
            resolve();
        });
    }

    async send(amount: BigNumber, destiantionAddress: string): Promise<void> {
        const stringifiedAmount = amount.multipliedBy(CosmosNetworkH.CURRENCY_1_CUDO).toString(10);

        const proposalTypePath = '/gravity.v1.MsgSendToEth'

        const chainId = Config.CUDOS_NETWORK.CHAIN_ID;
        await window.keplr.enable(chainId);
        const offlineSigner = window.getOfflineSigner(chainId);

        const account = (await offlineSigner.getAccounts())[0];

        
        const msgSend = [{
            typeUrl: proposalTypePath,
            value: {
                sender: account.address,
                ethDest: destiantionAddress,
                amount: {
                    amount: stringifiedAmount,
                    denom: CosmosNetworkH.CURRENCY_DENOM,
                },
                bridgeFee: {
                    amount: this.BRIDGE_FEE.multipliedBy(CosmosNetworkH.CURRENCY_1_CUDO).toString(),
                    denom: CosmosNetworkH.CURRENCY_DENOM,
                },
            },

        }];

        console.log(msgSend)
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
                [proposalTypePath, MsgSendToEth],
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

    async requestBatch() {
        const proposalTypePath = '/gravity.v1.MsgRequestBatch'

        const chainId = Config.CUDOS_NETWORK.CHAIN_ID;
        await window.keplr.enable(chainId);
        const offlineSigner = window.getOfflineSigner(chainId);

        const account = (await offlineSigner.getAccounts())[0];

        const msgSend = [{
            typeUrl: proposalTypePath,
            value: {
                sender: account.address,
                denom: CosmosNetworkH.CURRENCY_DENOM,
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
                [proposalTypePath, MsgRequestBatch],
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

            assertIsBroadcastTxSuccess(result);
        } catch (e) {
            console.log(e);
            this.walletError = 'Failed to send transaction!'
            throw new Error('Failed to send transaction!');
        }
    }

    async getBalance(): Promise<BigNumber> {
        this.walletError = null;
        try {
            const offlineSigner = window.getOfflineSigner(Config.CUDOS_NETWORK.CHAIN_ID);
            const account = (await offlineSigner.getAccounts())[0];

            const url = `${Config.CUDOS_NETWORK.API}/cosmos/bank/v1beta1/balances/${account.address}/by_denom?denom=${CosmosNetworkH.CURRENCY_DENOM}`;
            const amount = (await (await fetch(url)).json()).balance.amount;

            return new BigNumber(amount).div(CosmosNetworkH.CURRENCY_1_CUDO);
        } catch (e) {
            console.log(e);
            this.walletError = 'Failed to get balance!'
        }
    }

    setBridgeFee(bridgeFee: BigNumber) {
        if (bridgeFee.lt((new BigNumber(1)).dividedBy(CosmosNetworkH.CURRENCY_1_CUDO))) {
            return;
        }

        this.BRIDGE_FEE = bridgeFee;
    }

    isAddressValid(address: string): boolean {
        return address.startsWith(CosmosNetworkH.BECH32_PREFIX_ACC_ADDR) && address.length === CosmosNetworkH.BECH32_ACC_ADDR_LENGTH;
    }
}

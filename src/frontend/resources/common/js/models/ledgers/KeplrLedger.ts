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

    static NETWORK_NAME = 'Cudos';

    constructor() {
        this.connected = S.INT_FALSE;
        makeObservable(this);
    }

    async connect(onSuccess: Function, onError: Function): Promise<void> {
        if (!window.getOfflineSigner || !window.keplr) {
            onError('Error: Please install keplr extension');
            return;
        }

        if (window.keplr.experimentalSuggestChain) {
            try {
                await window.keplr.experimentalSuggestChain({
                    // Chain-id of the Cosmos SDK chain.
                    chainId: Config.CUDOS_NETWORK.CHAIN_ID,
                    // The name of the chain to be displayed to the user.
                    chainName: CosmosNetworkH.CHAIN_NAME,
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
                    walletUrlForStaking: Config.CUDOS_NETWORK.RPC,
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
                onError('Error: Failed to suggest the chain');
                console.log(ex);
            }
        } else {
            onError('Error: Please use the recent version of keplr extension');
        }
        // You should request Keplr to enable the wallet.
        // This method will ask the user whether or not to allow access if they haven't visited this website.
        // Also, it will request user to unlock the wallet if the wallet is locked.
        // If you don't request enabling before usage, there is no guarantee that other methods will work.
        await window.keplr.enable(Config.CUDOS_NETWORK.CHAIN_ID);

        const offlineSigner = window.getOfflineSigner(Config.CUDOS_NETWORK.CHAIN_ID);
        const account = (await offlineSigner.getAccounts())[0];

        this.connected = S.INT_TRUE;
    }

    async disconnect(): Promise<void> {

    }

    async send(amount: BigNumber, destiantionAddress: string, onSuccess: Function, onError: Function): Promise<void> {
        const stringifiedAmount = amount.multipliedBy(10 ** CosmosNetworkH.CURRENCY_DECIMALS).toString();

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
                    amount: Config.ORCHESTRATOR.BRIDGE_FEE,
                    denom: CosmosNetworkH.CURRENCY_DENOM,
                },
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

            assertIsBroadcastTxSuccess(result);
            onSuccess('Transaction sent successfully!');
        } catch (e) {
            onError('Error: Failed to send transaction!');
            console.log(e);
        }
    }

    async requestBatch(onSuccess: Function, onError: Function) {
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
            onSuccess('Transaction sent successfully!');
        } catch (e) {
            onError('Error: Failed to send transaction!');
            console.log(e);
        }
    }

    async getBalance(onError: Function): Promise<BigNumber> {
        try {
            const offlineSigner = window.getOfflineSigner(Config.CUDOS_NETWORK.CHAIN_ID);
            const account = (await offlineSigner.getAccounts())[0];

            const url = `${Config.CUDOS_NETWORK.API}/cosmos/bank/v1beta1/balances/${account.address}/${CosmosNetworkH.CURRENCY_DENOM}`;
            const amount = (await (await fetch(url)).json()).balance.amount;

            return new BigNumber(amount).div(10 ** CosmosNetworkH.CURRENCY_DECIMALS);
        } catch (e) {
            onError('Error: Failed get balance!');
            console.log(e);
        }

        return undefined;
    }

    isAddressValid(address: string): boolean {
        return address.startsWith(CosmosNetworkH.BECH32_PREFIX_ACC_ADDR) && address.length === CosmosNetworkH.BECH32_ACC_ADDR_LENGTH;
    }
}

import S from '../../utilities/Main';
import Ledger from './Ledger';
import { makeObservable, observable } from 'mobx';
import Web3 from 'web3';
import Web3Utils from 'web3-utils';
import ERC20TokenAbi from '../../solidity/contract_interfaces/ERC20_token.json';
import gravityContractAbi from '../../solidity/contract_interfaces/gravity.json';
import Config from '../../../../../../../builds/dev-generated/Config';
import BigNumber from 'bignumber.js';

import { Bech32, toBase64, toHex } from '@cosmjs/encoding';
import CosmosNetworkH from './CosmosNetworkH';

export default class MetamaskLedger implements Ledger {
    static NETWORK_NAME = 'Ethereum';
    @observable connected: number;
    @observable account: string;
    erc20Instance: any;
    gasPrice: string;
    gas: string;

    constructor() {
        this.connected = S.INT_FALSE;
        this.account = null;
        this.gasPrice = Config.ETHEREUM.ETHEREUM_GAS_PRICE;
        this.gas = Config.ETHEREUM.ETHEREUM_GAS;

        makeObservable(this);
    }

    async connect(): Promise<void> {
        try {
            await window.ethereum.request({
                method: 'wallet_requestPermissions',
                params: [
                  {
                    eth_accounts: {}
                  }
                ]
              });
            window.web3 = new Web3(window.ethereum);
            this.account = window.ethereum.selectedAddress;
            this.connected = S.INT_TRUE;
        } catch (e) {
            console.log(e);
            throw new Error('Failed to connect Metamask!');
        }
    }

    async disconnect(): Promise<void> {
        return new Promise < void >((resolve, reject) => {
            console.log('disconnecting...');
            resolve();
        });
    }

    async send(amount: BigNumber, destiantionAddress: string) {
        return new Promise < void >((resolve, reject) => {
            const run = async () => {
                const account = (await window.web3.eth.requestAccounts())[0];

                const addressByteArray = Bech32.decode(destiantionAddress).data;
                const addressBytes32Array = new Uint8Array(32);
                addressByteArray.forEach((byte, i) => { addressBytes32Array[32 - addressByteArray.length + i] = byte });

                const gravityContract = new window.web3.eth.Contract(gravityContractAbi, Config.ORCHESTRATOR.BRIDGE_CONTRACT_ADDRESS, {
                    from: account,
                    gasPrice: this.gasPrice,
                });
                const erc20Instance = new window.web3.eth.Contract(ERC20TokenAbi, Config.ORCHESTRATOR.ERC20_CONTRACT_ADDRESS);

                const stringAmount = amount.multipliedBy(CosmosNetworkH.CURRENCY_1_CUDO).toString(10);

                erc20Instance.methods.approve(Config.ORCHESTRATOR.BRIDGE_CONTRACT_ADDRESS, stringAmount)
                    .send({ from: account, gas: this.gas },
                        (err, transactionHash) => {
                            if (err) {
                                reject(err);
                                throw new Error('Failed to send transaction!');
                            }

                            gravityContract.methods.sendToCosmos(Config.ORCHESTRATOR.ERC20_CONTRACT_ADDRESS, `0x${toHex(addressBytes32Array)}`, stringAmount).send({ from: account, gas: this.gas })
                                .on('receipt', (confirmationNumber, receipt) => {
                                    resolve();
                                })
                                .on('error', (e) => {
                                    reject();
                                    throw new Error('Failed to send transaction!');
                                });
                        });
            }
            run();
        });

    }

    async requestBatch(): Promise<void> {
        return new Promise < void >((resolve, reject) => {
            resolve();
        });
    }

    async getBalance(): Promise<BigNumber> {
        try {
            const wallet = (await window.web3.eth.requestAccounts())[0];
            const erc20Contract = new window.web3.eth.Contract(ERC20TokenAbi, Config.ORCHESTRATOR.ERC20_CONTRACT_ADDRESS);

            const balance = await erc20Contract.methods.balanceOf(wallet).call();

            return (new BigNumber(balance)).div(CosmosNetworkH.CURRENCY_1_CUDO);
        } catch (e) {
            console.log(e);
            throw new Error('Failed to fetch balance!');
        }
    }

    isAddressValid(address): boolean {
        return Web3Utils.isAddress(address);
    }
}

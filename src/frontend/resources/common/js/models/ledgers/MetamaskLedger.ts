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
    erc20Instance: any;
    ERC20ContractAddress: string;
    bridgeContractAddress: string;
    gasPrice: string;
    gas: string;

    constructor() {
        this.connected = S.INT_FALSE;

        this.ERC20ContractAddress = Config.ORCHESTRATOR.ERC20_CONTRACT_ADDRESS;
        this.bridgeContractAddress = Config.ORCHESTRATOR.BRIDGE_CONTRACT_ADDRESS;

        this.gasPrice = Config.ETHEREUM.ETHEREUM_GAS_PRICE;
        this.gas = Config.ETHEREUM.ETHEREUM_GAS;

        makeObservable(this);
    }

    async connect(): Promise<void> {
        try {
            await window.ethereum.send('eth_requestAccounts');
            window.web3 = new Web3(window.ethereum);
            this.connected = S.INT_TRUE;
        } catch (e) {
            console.log(e);
            throw new Error('Failed to connect Metamask!');
        }
    }

    async disconnect(): Promise<void> {

    }

    async send(amount: BigNumber, destiantionAddress: string, onSuccess: Function, onError: Function) {
        const account = (await window.web3.eth.requestAccounts())[0];

        const addressByteArray = Bech32.decode(destiantionAddress).data;
        const addressBytes32Array = new Uint8Array(32);
        addressByteArray.forEach((byte, i) => { addressBytes32Array[32 - addressByteArray.length + i] = byte });

        const gravityContract = new window.web3.eth.Contract(gravityContractAbi, this.bridgeContractAddress, {
            from: account,
            gasPrice: this.gasPrice,
        });
        const erc20Instance = new window.web3.eth.Contract(ERC20TokenAbi, this.ERC20ContractAddress);

        const stringAmount = amount.multipliedBy(10 ** CosmosNetworkH.CURRENCY_DECIMALS).toString();

        erc20Instance.methods.approve(this.bridgeContractAddress, stringAmount)
            .send({ from: account, gas: this.gas },
                (err, transactionHash) => {
                    if (err) {
                        console.log(err);
                        throw new Error('Failed to send transaction!');
                    }

                    gravityContract.methods.sendToCosmos(this.ERC20ContractAddress, `0x${toHex(addressBytes32Array)}`, stringAmount).send({ from: account, gas: this.gas })
                        .on('receipt', (confirmationNumber, receipt) => {
                            onSuccess('Transaction sent successfully!');
                        })
                        .on('error', (e) => {
                            console.log(e);
                            throw new Error('Failed to send transaction!');
                        });
                });
    }

    async getBalance(onError: Function): Promise<BigNumber> {
        try {
            const wallet = (await window.web3.eth.requestAccounts())[0];
            const erc20Contract = new window.web3.eth.Contract(ERC20TokenAbi, this.ERC20ContractAddress);

            const balance = await erc20Contract.methods.balanceOf(wallet).call();

            return (new BigNumber(balance)).div(10 ** CosmosNetworkH.CURRENCY_DECIMALS);
        } catch (e) {
            console.log(e);
            throw new Error('Failed to fetch balance!');
        }
    }

    isAddressValid(address): boolean {
        return Web3Utils.isAddress(address);
    }
}

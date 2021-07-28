import S from '../../utilities/Main';
import Ledger from './Ledger';
import { makeObservable, observable } from 'mobx';
import Web3 from 'web3';
import Web3Utils from 'web3-utils';
import ERC20TokenAbi from '../../solidity/contract_interfaces/ERC20_token.json';
import gravityContractAbi from '../../solidity/contract_interfaces/gravity.json';
import Config from '../../../../../../../builds/dev-generated/Config';

import { Bech32, toBase64, toHex } from '@cosmjs/encoding';

export default class MetamaskLedger implements Ledger {
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
            window.ethereum.send('eth_requestAccounts');
            window.web3 = new Web3(window.ethereum);
            this.connected = S.INT_TRUE;
            return true;
        } catch (e) {
            return false;
        }
    }

    async disconnect(): Promise<void> {

    }

    async send(amount: number, destiantionAddress: string) {
        const account = (await window.web3.eth.requestAccounts())[0];

        const addressByteArray = Bech32.decode(destiantionAddress).data;
        const addressBytes32Array = new Uint8Array(32);
        addressByteArray.forEach((byte, i) => { addressBytes32Array[32 - addressByteArray.length + i] = byte });

        const gravityContract = new window.web3.eth.Contract(gravityContractAbi, this.bridgeContractAddress, {
            from: account,
            gasPrice: this.gasPrice,
        });
        const erc20Instance = new window.web3.eth.Contract(ERC20TokenAbi, this.ERC20ContractAddress);

        erc20Instance.methods.approve(this.bridgeContractAddress, amount)
            .send({ from: account, gas: this.gas },
                (err, transactionHash) => {
                    gravityContract.methods.sendToCosmos(this.ERC20ContractAddress, `0x${toHex(addressBytes32Array)}`, amount).send({ from: account, gas: this.gas })
                        .on('transactionHash', (hash) => {
                            // console.log(`Hash: ${hash}`);
                        })
                        .on('receipt', (receipt) => {
                            // console.log(`Receipt: ${receipt}`);
                        })
                        .on('confirmation', (confirmationNumber, receipt) => {
                            // console.log(`Confirmation: ${confirmationNumber}`);
                            // console.log(`Receipt: ${receipt}`);
                        })
                        .on('error', console.error);
                });
    }

    async getBalance(): Promise<number> {
        try {
            const wallet = (await window.web3.eth.requestAccounts())[0];
            const erc20Contract = new window.web3.eth.Contract(ERC20TokenAbi, this.ERC20ContractAddress);

            const balance = await erc20Contract.methods.balanceOf(wallet).call();
            const decimals = await erc20Contract.methods.decimals().call();

            return balance / (10 ** decimals);
        } catch (e) {
            console.log(e);
            return undefined;
        }
    }

    isAddressValid(address): boolean {
        return Web3Utils.isAddress(address);
    }
}

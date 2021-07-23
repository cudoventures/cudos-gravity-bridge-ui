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

    constructor() {
        this.connected = S.INT_FALSE;

        makeObservable(this);
    }

    connect(): boolean {
        try {
            window.ethereum.send('eth_requestAccounts');
            window.web3 = new Web3(window.ethereum);
            this.connected = S.INT_TRUE;
            return true;
        } catch (e) {
            return false;
        }
    }

    disconnect(): void {

    }

    send(amount: number, destiantionAddress: string) {
        const account = window.web3.eth.requestAccounts()[0];

        const ERC20ContractAddress = Config.ORCHESTRATOR.ERC20_CONTRACT_ADDRESS;
        const bridgeContractAddress = Config.ORCHESTRATOR.BRIDGE_CONTRACT_ADDRESS;

        const gasPrice = Config.ETHEREUM.ETHEREUM_GAS_PRICE;
        const gas = Config.ETHEREUM.ETHEREUM_GAS;

        const addressByteArray = Bech32.decode(destiantionAddress).data;
        const addressByteArrayString = addressByteArray.toString().split(',').join('');

        const decodedAddress = `0x${'0'.repeat(62 - addressByteArrayString.length)}${addressByteArrayString}`;
        console.log(decodedAddress);

        const myContract = new window.web3.eth.Contract(gravityContractAbi, bridgeContractAddress, {
            from: account,
            gasPrice,
        });

        const erc20Instance = new window.web3.eth.Contract(ERC20TokenAbi, ERC20ContractAddress);

        // 0x00000000000035991543142242222130103601299692251231174525577191
        erc20Instance.methods.approve(bridgeContractAddress, amount)
            .send({ from: account, gas },
                (err, transactionHash) => {
                    myContract.methods.sendToCosmos(ERC20ContractAddress, decodedAddress, amount).send({ from: account, gas })
                        .on('transactionHash', (hash) => {
                            console.log(`Hash: ${hash}`);
                        })
                        .on('receipt', (receipt) => {
                            console.log(`Receipt: ${receipt}`);
                        })
                        .on('confirmation', (confirmationNumber, receipt) => {
                            console.log(`Confirmation: ${confirmationNumber}`);
                            console.log(`Receipt: ${receipt}`);
                        })
                        .on('error', console.error);
                });
    }

    isAddressValid(address): boolean {
        return Web3Utils.isAddress(address);
    }
}

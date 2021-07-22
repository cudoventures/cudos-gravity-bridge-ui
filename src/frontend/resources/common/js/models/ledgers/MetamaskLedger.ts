import S from '../../utilities/Main';
import Ledger from './Ledger';
import { makeObservable, observable } from 'mobx';
import Web3 from 'web3';
import ERC20TokenAbi from '../../../../../../solidity/contract_interfaces/ERC20_token.json';
import gravityContractAbi from '../../../../../../solidity/contract_interfaces/gravity.json';

import bech32 from '@cosmjs/encoding';

const ERC20ContractAddress = '0x28ea52f3ee46cac5a72f72e8b3a387c0291d586d';
const contractAddress = '0xb114942d4abf8E907015F0a03e421268A0919cca';

export default class MetamaskLedger implements Ledger {
    @observable connected: number;

    constructor(){
        this.connected = S.INT_FALSE;

        makeObservable(this);
    }

    connect(): boolean {
        try{
            window.ethereum.send('eth_requestAccounts');
            window.web3 = new Web3(window.ethereum);
            this.connected = S.INT_TRUE;
            return true;
        } catch(e){
            return false;
        }
    }

    disconnect(): void {
        
    }

    send(amount: number, destiantionAddress: string) {
        const account = window.web3.eth.requestAccounts()[0];
        
        var myContract = new window.web3.eth.Contract(gravityContractAbi, contractAddress, {
            from: account,
            gasPrice: '2000000008'
        });
  
  
        var erc20Instance = new window.web3.eth.Contract(ERC20TokenAbi,ERC20ContractAddress);
  
        erc20Instance.methods.approve(contractAddress, amount)
            .send({from: account, gas: 2000000}, 
            function(err, transactionHash) {
  
                myContract.methods.sendToCosmos(ERC20ContractAddress, '0x00000000000035991543142242222130103601299692251231174525577191', amount).send({gas: 200000})
                    .on('transactionHash', function(hash){
                        console.log('Hash: ' + hash);
                    })
                    .on('receipt', function(receipt){
                        console.log('Receipt: ' + receipt);
                    })
                    .on('confirmation', function(confirmationNumber, receipt){
                        console.log('Confirmation: ' + confirmationNumber);
                        console.log('Receipt: ' + receipt);
                    })
                    .on('error', console.error);
            }
        );
    }
}
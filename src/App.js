import './App.css';
const Web3 = require('web3');
const ERC20TokenAbi = require('./solidity/contract_interfaces/ERC20_token.json');
const gravityContractAbi = require('./solidity/contract_interfaces/gravity.json');
const bech32 = require('@cosmjs/encoding');

const ERC20ContractAddress = '0x28ea52f3ee46cac5a72f72e8b3a387c0291d586d';
const cosmosAddress = 'cudos1gg3zzvqsxcqjn95jy5frz969y4thrygq7z8mua';
const contractAddress = '0xb114942d4abf8E907015F0a03e421268A0919cca';

const amount = 23561;


function App() {

  const sendTransaction = async () => {

    if (window.ethereum) {
      await window.ethereum.send('eth_requestAccounts');
      window.web3 = new Web3(window.ethereum);
      const account = (await window.web3.eth.requestAccounts())[0];



      // console.log(bech32);
      // console.log(bech32.Bech32.decode(cosmosAddress));

      // const add = window.Web3.utils.hexToBytes(window.Web3.utils.asciiToHex(cosmosAddress));
      // console.log(window.Web3.utils.asciiToHex(cosmosAddress));

      console.log(account);
      
    }
  }

  return (
    <button className="App" onClick={sendTransaction}>
      Send transaction
    </button>
  );
}

export default App;

import logo from './logo.svg';
import './App.css';
const Web3 = require('web3');
const abi = require('./token.json');
const gravityContractAbi = require('./interface.json');
const bech32 = require('@cosmjs/encoding');

const ERC20ContractAddress = '0x28ea52f3ee46cac5a72f72e8b3a387c0291d586d';
const cosmosAddress = 'cudos1gg3zzvqsxcqjn95jy5frz969y4thrygq7z8mua';
const ethPrivateKey = '45c517f199dccb2caece0b802c601ad7407bb658539b89ef80b0fac949c8c051';
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
      var myContract = new window.web3.eth.Contract(gravityContractAbi, contractAddress, {
          from: account,
          gasPrice: '2000000008'
      });


      var erc20Instance = new window.web3.eth.Contract(abi,ERC20ContractAddress);

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

  return (
    <button className="App" onClick={sendTransaction}>
      Send transaction
    </button>
  );
}

export default App;

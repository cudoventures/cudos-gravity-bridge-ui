import S from "../../utilities/Main";
import Ledger from "./Ledger";
import { makeObservable, observable } from "mobx";
import Web3 from "web3";
import Web3Utils from "web3-utils";
import ERC20TokenAbi from "../../solidity/contract_interfaces/ERC20_token.json";
import gravityContractAbi from "../../solidity/contract_interfaces/gravity.json";
import Config from "../../../../../../../builds/dev-generated/Config";
import BigNumber from "bignumber.js";

import { Bech32, toBase64, toHex, CudosNetworkConsts } from "cudosjs";

export default class MetamaskLedger implements Ledger {
  static NETWORK_NAME = "Ethereum";
  @observable connected: number;
  @observable account: string;
  @observable walletError: string;
  @observable txHash: string;
  @observable txNonce: string;
  erc20Instance: any;
  gas: string;

  constructor() {
    this.connected = S.INT_FALSE;
    this.account = null;
    this.gas = Config.ETHEREUM.ETHEREUM_GAS;
    this.walletError = null;
    this.txHash = null;

    makeObservable(this);
  }

  async connect(): Promise<void> {
    this.walletError = null;
    try {
      if (localStorage.getItem("manualAccountChange") === "true") {
        await window.ethereum.send("eth_requestAccounts");
      } else {
        await window.ethereum.request({
          method: "wallet_requestPermissions",
          params: [
            {
              eth_accounts: {},
            },
          ],
        });
      }
      localStorage.setItem("manualAccountChange", "false");
      window.web3 = new Web3(window.ethereum);
      this.account = window.ethereum.selectedAddress;
      this.connected = S.INT_TRUE;
    } catch (e) {
      if (!window.ethereum) {
        this.walletError =
          "Metamask wallet not found! Please install to continue!";
      } else {
        this.walletError = "User rejected the request!";
      }
    }
  }

  async disconnect(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      resolve();
    });
  }

  async send(amount: BigNumber, destinationAddress: string) {
    this.walletError = null;
    return new Promise<void>((resolve, reject) => {
      const run = async () => {
        const account = (await window.web3.eth.requestAccounts())[0];

        const addressByteArray = Bech32.decode(destinationAddress).data;
        const addressBytes32Array = new Uint8Array(32);
        addressByteArray.forEach((byte, i) => {
          addressBytes32Array[32 - addressByteArray.length + i] = byte;
        });

        const gravityContract = new window.web3.eth.Contract(
          gravityContractAbi,
          Config.ORCHESTRATOR.BRIDGE_CONTRACT_ADDRESS,
          {
            from: account,
          }
        );
        const erc20Instance = new window.web3.eth.Contract(
          ERC20TokenAbi,
          Config.ORCHESTRATOR.ERC20_CONTRACT_ADDRESS
        );

        const stringAmount = amount
          .multipliedBy(CudosNetworkConsts.CURRENCY_1_CUDO)
          .toString(10);

        erc20Instance.methods
          .approve(Config.ORCHESTRATOR.BRIDGE_CONTRACT_ADDRESS, stringAmount)
          .send({ from: account }, (err, transactionHash) => {
            if (err) {
              reject(err);

              this.walletError = "Failed to send transaction!";
              throw new Error("Failed to send transaction!");
            }

            gravityContract.methods
              .sendToCosmos(
                Config.ORCHESTRATOR.ERC20_CONTRACT_ADDRESS,
                `0x${toHex(addressBytes32Array)}`,
                stringAmount
              )
              .send({ from: account, gas: this.gas })
              .on("receipt", confirmationNumber => {
                resolve();
                this.txHash = confirmationNumber.transactionHash;
                this.txNonce =
                  confirmationNumber.events.SendToCosmosEvent.returnValues._eventNonce;
              })
              .on("error", e => {
                reject();
                this.walletError = "Failed to send transaction!";
                throw new Error("Failed to send transaction!");
              });
          });
      };
      run();
    });
  }

  async getBalance(): Promise<BigNumber> {
    this.walletError = null;
    try {
      const wallet = (await window.web3.eth.requestAccounts())[0];
      const erc20Contract = new window.web3.eth.Contract(
        ERC20TokenAbi,
        Config.ORCHESTRATOR.ERC20_CONTRACT_ADDRESS
      );

      const balance = await erc20Contract.methods.balanceOf(wallet).call();

      return new BigNumber(balance).div(CudosNetworkConsts.CURRENCY_1_CUDO);
    } catch (e) {
      this.walletError = "Failed to fetch balance";
    }
  }

  isAddressValid(address): boolean {
    return Web3Utils.isAddress(address);
  }
}

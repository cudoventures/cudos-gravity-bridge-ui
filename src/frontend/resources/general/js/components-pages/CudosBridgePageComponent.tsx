/* global TR */

import React, { RefObject } from "react";

import ContextPageComponent, {
  ContextPageComponentProps,
} from "./common/ContextPageComponent";
import TransferForm from "./TransferForm";
import SummaryForm from "./SummaryForm";
import SummaryModal from "../../../common/js/components-popups/SummaryModal";
import FailureModal from "../../../common/js/components-popups/FailureModal";
import LoadingModal from "../../../common/js/components-popups/LoadingModal";
import PreFlightModal from "../../../common/js/components-popups/PreFlightModal";

import Config from "../../../../../../builds/dev-generated/Config";
import "./../../css/components-pages/cudos-bridge-component.css";
import PageComponent from "../../../common/js/components-pages/PageComponent";
import { inject, observer } from "mobx-react";
import BigNumber from "bignumber.js";

import S from "../../../common/js/utilities/Main";
import NetworkStore from "../../../common/js/stores/NetworkStore";
import KeplrLedger from "../../../common/js/models/ledgers/KeplrLedger";
import ProjectUtils from "../../../common/js/ProjectUtils";
import Ledger from "../../../common/js/models/ledgers/Ledger";
import {
  CudosNetworkConsts,
  generateMsg,
  GasPrice,
  StargateClient,
  coin,
} from "cudosjs";
import MetamaskLedger from "../../../common/js/models/ledgers/MetamaskLedger";
import Web3 from "web3";
import ERC20TokenAbi from "../../../common/js/solidity/contract_interfaces/ERC20_token.json";

import { Long } from "long";

interface Props extends ContextPageComponentProps {
  networkStore: NetworkStore;
}

interface State {
  preFlight: boolean;
  preFlightAmount: string;
  preFlightToAddress: string;
  preFlightFromAddress: string;
  preFlightToNetwork: string;
  preFlightFromNetwork: string;
  selectedFromNetwork: number;
  selectedToNetwork: number;
  isFromConnected: boolean;
  isToConnected: boolean;
  amount: BigNumber;
  displayAmount: string;
  walletBalance: BigNumber;
  amountError: number;
  destinationAddress: string;
  destiantionAddressError: number;
  contractBalance: BigNumber;
  summary: boolean;
  isOpen: boolean;
  isTransferring: boolean;
  isTransactionFail: boolean;
  isLoading: boolean;
  errorMessage: string;
  txHash: string;
  destTxHash: string;
  minTransferAmount: BigNumber;
  minBridgeFeeAmount: BigNumber;
  estimatedGasFees: BigNumber;
  validAmount: Boolean;
  loadingModalAdditionalText: string;
}

const cudosMainLogo =
  "../../../../resources/common/img/favicon/cudos-40x40.svg";
const cudosFont = "../../../../resources/common/img/favicon/cudos-font.svg";
const transferLogoAlt =
  "../../../../resources/common/img/favicon/transfer-logo-alt.svg";
const keplrLink =
  "https://chrome.google.com/webstore/detail/keplr/dmkamcknogkgcdfhhbddcghachkejeap?hl=en";

export default class CudosBridgeComponent extends ContextPageComponent<
  Props,
  State
> {
  inputTimeouts: any;
  root: RefObject<HTMLDivElement>;

  static layout() {
    const MobXComponent = inject(
      "appStore",
      "alertStore",
      "networkStore"
    )(observer(CudosBridgeComponent));
    PageComponent.layout(<MobXComponent />);
  }

  constructor(props: Props) {
    super(props);

    this.state = {
      preFlight: false,
      preFlightAmount: S.Strings.EMPTY,
      preFlightToAddress: S.Strings.EMPTY,
      preFlightFromAddress: S.Strings.EMPTY,
      preFlightToNetwork: S.Strings.EMPTY,
      preFlightFromNetwork: S.Strings.EMPTY,
      selectedFromNetwork: S.INT_TRUE,
      selectedToNetwork: S.INT_FALSE,
      isFromConnected: false,
      isToConnected: false,
      amount: new BigNumber(0),
      displayAmount: S.Strings.EMPTY,
      walletBalance: new BigNumber(0),
      amountError: S.INT_FALSE,
      destinationAddress: S.Strings.EMPTY,
      destiantionAddressError: S.INT_FALSE,
      contractBalance: new BigNumber(0),
      summary: false,
      isOpen: false,
      isTransactionFail: false,
      isTransferring: false,
      isLoading: false,
      errorMessage: null,
      txHash: null,
      destTxHash: null,
      minTransferAmount: new BigNumber(0),
      minBridgeFeeAmount: new BigNumber(0),
      estimatedGasFees: new BigNumber(0),
      validAmount: false,
      loadingModalAdditionalText: "",
    };

    this.root = React.createRef();

    this.inputTimeouts = {
      amount: null,
      destiantionAddress: null,
    };
  }

  getAccountBalance = async (account: string): Promise<string> => {
    let accountBalance: string;

    const rpc: string = Config.CUDOS_NETWORK.RPC;
    const queryClient: StargateClient =
      this.props.networkStore.networkHolders[1].ledger.queryClient;

    try {
      accountBalance = (await queryClient.getBalance(account, "acudos")).amount;
    } catch (e) {
      accountBalance = "0";
    }
    return accountBalance;
  };

  getModuleBalance = async (): Promise<BigNumber> => {
    try {
      const gravityModuleAddress = Config.CUDOS_NETWORK.GRAVITY_MODULE_ADDRESS;
      const balance = await this.getAccountBalance(gravityModuleAddress);
      let moduleBalance = new BigNumber(balance);
      if (moduleBalance.gt(0)) {
        moduleBalance = moduleBalance.div(CudosNetworkConsts.CURRENCY_1_CUDO);
      } else {
        moduleBalance = new BigNumber(0);
      }
      return moduleBalance;
    } catch (e) {
      throw new Error("Failed to fetch module balance!");
    }
  };

  async getContractBalance(): Promise<BigNumber> {
    try {
      const contractWallet = Config.ORCHESTRATOR.BRIDGE_CONTRACT_ADDRESS;
      const web3 = new Web3(Config.ETHEREUM.ETHEREUM_RPC);
      const erc20Contract = new web3.eth.Contract(
        ERC20TokenAbi,
        Config.ORCHESTRATOR.ERC20_CONTRACT_ADDRESS
      );

      const balance = await erc20Contract.methods
        .balanceOf(contractWallet)
        .call();

      return new BigNumber(balance).div(CudosNetworkConsts.CURRENCY_1_CUDO);
    } catch (e) {
      throw new Error("Failed to fetch balance!");
    }
  }

  getPageLayoutComponentCssClassName() {
    return "CudosBridge";
  }

  isFromCosmos(networkId: number = null) {
    if (networkId === null) {
      networkId = this.state.selectedFromNetwork;
    }

    if (networkId === S.NOT_EXISTS) {
      return false;
    }

    const ledger = this.props.networkStore.networkHolders[networkId].ledger;

    return ledger instanceof KeplrLedger;
  }

  isFromEth(networkId: number = null) {
    if (networkId === null) {
      networkId = this.state.selectedFromNetwork;
    }

    if (networkId === S.NOT_EXISTS) {
      return false;
    }

    const ledger = this.props.networkStore.networkHolders[networkId].ledger;
    return ledger instanceof MetamaskLedger;
  }

  onDisconnectFromNetwork = async (): Promise<void> => {
    if (this.state.isFromConnected) {
      this.setState({
        isFromConnected: false,
      });
    }
  };

  onDisconnectToNetwork = async (): Promise<void> => {
    if (this.state.isToConnected) {
      this.setState({
        isToConnected: false,
      });
    }
  };

  onSelectFromNetwork = async (): Promise<void> => {
    let balance = new BigNumber(0);
    let ledger = null;
    const toNetwork = null;
    let fromNetwork = null;
    let contractBalance = new BigNumber(0);
    let connectionError = false;
    const account = null;

    try {
      fromNetwork = this.state.selectedFromNetwork;
      ledger = await this.connectWallet(fromNetwork);
      if (await ledger.walletError) {
        this.setState({
          isTransactionFail: true,
          errorMessage: ledger.walletError,
        });
        connectionError = true;
        balance = new BigNumber(0);
        contractBalance = new BigNumber(0);
      }
      balance = await ledger.getBalance();
      if (!balance) {
        balance = new BigNumber(0);
      }
      if (this.isFromCosmos(fromNetwork) === true) {
        contractBalance = await this.getContractBalance();
      } else {
        contractBalance = await this.getModuleBalance();
      }
    } catch (e) {
      this.showAlertError(e.toString());
      connectionError = true;
      balance = new BigNumber(0);
      contractBalance = new BigNumber(0);
    }
    if (!connectionError) {
      this.setState({
        selectedFromNetwork: fromNetwork,
        isFromConnected: true,
        amount: new BigNumber(0),
        displayAmount: S.Strings.EMPTY,
        amountError: S.INT_FALSE,
        destinationAddress: S.Strings.EMPTY,
        destiantionAddressError: S.INT_FALSE,
        walletBalance: balance,
        contractBalance,
      });
    }
  };

  onSelectToNetwork = async (): Promise<void> => {
    let balance = new BigNumber(0);
    let ledger = null;
    let toNetwork = null;
    const fromNetwork = null;
    let contractBalance = new BigNumber(0);
    let connectionError = false;

    try {
      toNetwork = this.state.selectedToNetwork;
      ledger = await this.connectWallet(toNetwork);
      if (await ledger.walletError) {
        this.setState({
          isTransactionFail: true,
          errorMessage: ledger.walletError,
        });
        connectionError = true;
        balance = new BigNumber(0);
        contractBalance = new BigNumber(0);
      }
      balance = await ledger.getBalance();
      if (!balance) {
        balance = new BigNumber(0);
      }
      if (this.isFromCosmos(toNetwork) === true) {
        contractBalance = await this.getContractBalance();
      } else {
        contractBalance = await this.getModuleBalance();
      }
    } catch (e) {
      this.showAlertError(e.toString());
      connectionError = true;
      balance = new BigNumber(0);
      contractBalance = new BigNumber(0);
    }
    if (!connectionError) {
      this.setState({
        selectedToNetwork: toNetwork,
        isToConnected: true,
        amount: new BigNumber(0),
        displayAmount: S.Strings.EMPTY,
        amountError: S.INT_FALSE,
        destinationAddress: S.Strings.EMPTY,
        destiantionAddressError: S.INT_FALSE,
      });
    }
  };

  onClickMaxAmount = async () => {
    const ledger = await this.checkWalletConnected();
    const fromNetwork = this.state.selectedFromNetwork;
    const maxButtonMultiplier = 1.05; // Fixing issue, when fee estimates are less for MAX amount than smaller number entered by hand.
    const balance = await ledger.getBalance();
    let simulatedCost = new BigNumber(0);

    if (!balance) {
      return;
    }

    let maximumAmount = BigNumber.min(balance, this.state.contractBalance);

    if (maximumAmount.gt(0) && this.isFromCosmos(fromNetwork)) {
      maximumAmount = maximumAmount.minus(this.state.minBridgeFeeAmount);
      if (maximumAmount.lte(0)) {
        return;
      }

      simulatedCost = await this.simulatedMsgsCost(maximumAmount.toFixed());
      maximumAmount = maximumAmount.minus(
        simulatedCost.multipliedBy(maxButtonMultiplier)
      );
    }

    if (maximumAmount.lte(0)) {
      return;
    }

    maximumAmount = maximumAmount.dp(18, BigNumber.ROUND_FLOOR);

    this.setState({
      amount: maximumAmount,
      displayAmount: maximumAmount.toFixed(),
      walletBalance: balance,
      estimatedGasFees: simulatedCost.multipliedBy(maxButtonMultiplier),
      validAmount: true,
      amountError: S.INT_FALSE,
    });
  };

  onGetBalance = async () => {
    const ledger = await this.checkWalletConnected();
    let balance = await ledger.getBalance();
    if (!balance) {
      balance = new BigNumber(0);
    }
    this.setState({
      walletBalance: balance,
    });
  };

  onChangeAmount = async (amount: string) => {
    clearTimeout(this.inputTimeouts.amount);
    let bigAmount = new BigNumber(amount);
    const fromNetwork = this.state.selectedFromNetwork;
    let validAmount = false;
    let amountError = S.INT_TRUE;
    let simulatedCost = new BigNumber(0);
    this.setState({
      amount: bigAmount,
      displayAmount: amount,
    });

    if (
      !bigAmount.isNaN() &&
      !bigAmount.isLessThan(
        new BigNumber(1).dividedBy(CudosNetworkConsts.CURRENCY_1_CUDO)
      ) &&
      this.validCudosNumber(amount)
    ) {
      this.inputTimeouts.amount = setTimeout(async () => {
        if (this.isFromCosmos(fromNetwork)) {
          if (
            bigAmount
              .plus(this.state.minBridgeFeeAmount)
              .isLessThanOrEqualTo(this.state.walletBalance)
          ) {
            simulatedCost = await this.simulatedMsgsCost(bigAmount.toString());
            bigAmount = bigAmount.plus(simulatedCost);
          }

          bigAmount = bigAmount.plus(this.state.minBridgeFeeAmount);
        }

        if (
          bigAmount.isLessThanOrEqualTo(this.state.walletBalance) &&
          (!this.isFromCosmos(fromNetwork) ||
            bigAmount.isLessThanOrEqualTo(this.state.contractBalance))
        ) {
          validAmount = true;
          amountError = S.INT_FALSE;
        }

        this.setState({
          validAmount,
          amountError,
          estimatedGasFees: simulatedCost,
        });
      }, 500);

      return;
    }

    this.setState({
      validAmount,
      amountError,
      estimatedGasFees: simulatedCost,
    });
  };

  onChangeDestinationAddress = (address: string) => {
    clearTimeout(this.inputTimeouts.destiantionAddress);

    this.setState({
      destinationAddress: address,
      destiantionAddressError: S.INT_FALSE,
    });

    this.inputTimeouts.destiantionAddress = setTimeout(() => {
      if (address === S.Strings.EMPTY) {
        return;
      }

      if (!this.isAddressValid(this.state.destinationAddress)) {
        this.setState({
          destiantionAddressError: S.INT_TRUE,
        });
      }
    }, 1000);
  };

  onClickSend = async () => {
    if (this.state.amount.isGreaterThan(this.state.walletBalance)) {
      this.setState({
        errorMessage:
          "The amount you entered is more than what you have in your wallet!",
        isTransactionFail: true,
      });
      return;
    }

    if (this.state.amountError === S.INT_TRUE) {
      this.setState({
        errorMessage: "Please enter a valid amount of tokens!",
        isTransactionFail: true,
        amountError: 0,
      });
      return;
    }
    const ledger =
      this.props.networkStore.networkHolders[this.state.selectedFromNetwork]
        .ledger;

    if (ledger instanceof KeplrLedger) {
      ledger.setBridgeFee(
        new BigNumber(this.state.minBridgeFeeAmount).multipliedBy(
          CudosNetworkConsts.CURRENCY_1_CUDO
        )
      );
    }

    this.setState({
      preFlight: true,
      preFlightAmount: this.state.displayAmount,
      preFlightFromAddress: this.getAddress(this.state.selectedFromNetwork, 6),
      preFlightToAddress: this.getAddress(this.state.selectedToNetwork, 6),
      preFlightFromNetwork: this.state.selectedFromNetwork
        ? ProjectUtils.CUDOS_NETWORK_TEXT
        : ProjectUtils.ETHEREUM_NETWORK_TEXT,
      preFlightToNetwork: this.state.selectedToNetwork
        ? ProjectUtils.CUDOS_NETWORK_TEXT
        : ProjectUtils.ETHEREUM_NETWORK_TEXT,
    });
  };

  executeTransaction = async () => {
    this.setState({ preFlight: false });
    try {
      this.props.appStore.disableActions();
      this.setState({
        isTransferring: true,
        isLoading: true,
        loadingModalAdditionalText: "",
      });
      const ledger = await this.checkWalletConnected();
      await ledger.send(
        this.state.amount,
        this.getAddress(this.state.selectedToNetwork, 0)
      );
      const txHash = ledger.txHash;

      let destTxHash = "";
      if (!this.isFromCosmos(this.state.selectedFromNetwork)) {
        this.setState({
          loadingModalAdditionalText: `Transaction confirmed on ${ProjectUtils.ETHEREUM_NETWORK_TEXT} with HASH: ${txHash}. Awaiting TX confirmation on ${ProjectUtils.CUDOS_NETWORK_TEXT} - it may take a few minutes.`,
        });
        destTxHash = await this.getCosmosGravityTxByNonce(ledger.txNonce);
      }
      this.setState({
        isOpen: true,
        isLoading: false,
        loadingModalAdditionalText: "",
        txHash,
        destTxHash,
      });
    } catch (e) {
      const ledger = await this.checkWalletConnected();
      this.setState({
        isTransactionFail: true,
        isLoading: false,
        errorMessage: ledger.walletError,
      });
    } finally {
      this.setState({
        amount: new BigNumber(0),
        isTransferring: false,
        isLoading: false,
        amountError: S.INT_FALSE,
        destinationAddress: S.Strings.EMPTY,
        destiantionAddressError: S.INT_FALSE,
      });

      this.props.appStore.enableActions();
    }
  };

  onChnageTransactionDirection = async (): Promise<void> => {
    const toNetwork = this.state.selectedToNetwork;
    const fromNetwork = this.state.selectedFromNetwork;
    const toConnected = this.state.isToConnected;
    const fromConnected = this.state.isFromConnected;
    let balance = new BigNumber(0);
    let contractBalance = new BigNumber(0);
    let ledger = null;
    let connectionError = false;

    try {
      const networkId = toNetwork;
      ledger = this.props.networkStore.networkHolders[networkId].ledger;

      if (toConnected) {
        balance = await ledger.getBalance();
        if (!balance) {
          balance = new BigNumber(0);
        }
      }
      if (this.isFromCosmos(toNetwork) === true) {
        contractBalance = await this.getContractBalance();
      } else {
        contractBalance = await this.getModuleBalance();
      }
    } catch (e) {
      this.showAlertError(e.toString());
      connectionError = true;
      balance = new BigNumber(0);
      contractBalance = new BigNumber(0);
    }

    if (!connectionError) {
      this.setState({
        displayAmount: S.Strings.EMPTY,
        selectedFromNetwork: toNetwork,
        selectedToNetwork: fromNetwork,
        isToConnected: fromConnected,
        isFromConnected: toConnected,
        walletBalance: balance,
        contractBalance,
      });
    }
  };

  checkWalletConnected = async () => {
    const networkId = this.state.selectedFromNetwork;
    const ledger = this.props.networkStore.networkHolders[networkId].ledger;

    if (!ledger.connected) {
      await this.connectWallet(this.state.selectedFromNetwork);
    }

    return ledger;
  };

  connectWallet = async (networkId: number): Promise<Ledger> => {
    const networkHolders = this.props.networkStore.networkHolders;

    const ledger = networkHolders[networkId].ledger;
    await ledger.connect();

    return ledger;
  };

  onChangeAccount = async (): Promise<void> => {
    const toNetwork = this.state.selectedToNetwork;
    const fromNetwork = this.state.selectedFromNetwork;
    const fromConnected = this.state.isFromConnected;
    let balance = new BigNumber(0);
    let contractBalance = new BigNumber(0);
    let ledger = null;
    let connectionError = false;

    try {
      ledger = this.props.networkStore.networkHolders[fromNetwork].ledger;

      if (fromConnected) {
        balance = await ledger.getBalance();
        if (!balance) {
          balance = new BigNumber(0);
        }
      }
      if (this.isFromCosmos(fromNetwork) === true) {
        contractBalance = await this.getContractBalance();
      } else {
        contractBalance = await this.getModuleBalance();
      }
    } catch (e) {
      this.showAlertError(e.toString());
      connectionError = true;
      balance = new BigNumber(0);
      contractBalance = new BigNumber(0);
    }

    if (!connectionError) {
      this.setState({
        displayAmount: S.Strings.EMPTY,
        selectedFromNetwork: fromNetwork,
        selectedToNetwork: toNetwork,
        walletBalance: balance,
        contractBalance,
      });
    }
  };

  showAlertError(msg) {
    this.props.alertStore.show(<div className={"Error"}>{msg}</div>);
  }

  showAlertSuccess(msg) {
    this.props.alertStore.show(<div className={"Success"}>{msg}</div>);
  }

  isAddressValid = address => {
    const ledger =
      this.props.networkStore.networkHolders[this.state.selectedToNetwork]
        .ledger;

    return ledger.isAddressValid(address);
  };

  getLogoName = network => {
    if (network) {
      return `${network.name.toLowerCase()}-logo.png`;
    }

    return "";
  };

  getAddress = (networkId: number, sliceIndex: number): string => {
    try {
      const ledger = this.props.networkStore.networkHolders[networkId].ledger;
      if (sliceIndex === 0) {
        return ledger.account;
      }
      return this.formatText(ledger.account, sliceIndex);
    } catch (e) {
      this.showAlertError(e.toString());
    }

    return "";
  };

  formatText(text: string, sliceIndex: number): string {
    if (!text) {
      return null;
    }
    const len = text.length;
    if (text === null || text.length < 10) {
      return text;
    }
    return `${text.slice(0, sliceIndex)}...${text.slice(len - 4, len)}`;
  }

  goToTransactionSummary = async (): Promise<void> => {
    await this.getMinTransferAndBridgeFeeAmounts();
    this.setState({
      summary: true,
    });
  };

  validCudosNumber = (amount: string) => {
    // Should be a whole number or a float with maximum 18 digits after the point
    const checkResult = amount.replace(/^[0-9]+\.?[0-9]{0,18}$/gm, "OK");
    return checkResult === "OK";
  };

  simulatedMsgsCost = async (amount: string): Promise<BigNumber> => {
    let simulatedCost = new BigNumber(0);
    const stringifiedAmount = new BigNumber(amount)
      .multipliedBy(CudosNetworkConsts.CURRENCY_1_CUDO)
      .toString(10);
    const ledger =
      this.props.networkStore.networkHolders[this.state.selectedFromNetwork]
        .ledger;
    const [offlineSigner, account] = await ledger.GetKeplrSignerAndAccount();
    const client = await ledger.GetKeplrSigningClient(offlineSigner);

    let destination: string;
    let sender: string;

    if (this.isFromCosmos(this.state.selectedFromNetwork) === true) {
      sender = this.getAddress(this.state.selectedFromNetwork, 0);
      destination = this.getAddress(this.state.selectedToNetwork, 0);
    } else {
      destination = this.getAddress(this.state.selectedFromNetwork, 0);
      sender = this.getAddress(this.state.selectedToNetwork, 0);
    }

    const gasPrice = GasPrice.fromString(
      `${Config.CUDOS_NETWORK.GAS_PRICE}acudos`
    );
    const simulatedMsg = generateMsg("msgSendToEth", {
      sender,
      ethDest: destination,
      amount: coin(stringifiedAmount, CudosNetworkConsts.CURRENCY_DENOM),
      bridgeFee: coin(
        this.state.minBridgeFeeAmount
          .multipliedBy(CudosNetworkConsts.CURRENCY_1_CUDO)
          .toString(10),
        CudosNetworkConsts.CURRENCY_DENOM
      ),
    });

    const approxCost = await ledger.EstimateFee(
      client,
      account.address,
      [simulatedMsg],
      gasPrice,
      "Fee Estimation Message"
    );
    const estimatedCost = approxCost.amount[0]
      ? approxCost.amount[0].amount
      : "0";
    simulatedCost = new BigNumber(estimatedCost).dividedBy(
      CudosNetworkConsts.CURRENCY_1_CUDO
    );
    return simulatedCost;
  };

  getMinTransferAndBridgeFeeAmounts = async (): Promise<void> => {
    const response =
      await this.props.networkStore.networkHolders[1].ledger.queryClient.gravityModule.getParams();
    const minTransferAmount = response.params.minimumTransferToEth;
    const minBridgeFeeAmount = response.params.minimumFeeTransferToEth;

    if (minTransferAmount === undefined || minBridgeFeeAmount === undefined) {
      this.setState({
        isTransactionFail: true,
        errorMessage: "We cannot proceed with your request at the moment",
      });
      throw new Error(
        "Failed to fetch minimum transfer and minimum transfer fee amount"
      );
    }
    this.setState({
      minTransferAmount: new BigNumber(minTransferAmount).dividedBy(
        CudosNetworkConsts.CURRENCY_1_CUDO
      ),
      minBridgeFeeAmount: new BigNumber(minBridgeFeeAmount).dividedBy(
        CudosNetworkConsts.CURRENCY_1_CUDO
      ),
    });
  };

  getCosmosGravityTxByNonce = async (nonce: string): Promise<string> => {
    let result = "";
    const qClient =
      this.props.networkStore.networkHolders[1].ledger.queryClient;
    const heightRes = await qClient.getHeight();
    let height = Number(heightRes);
    while (result === "") {
      const txData = await qClient.searchTx({
        tags: [
          { key: "message.action", value: "/gravity.v1.MsgSendToCosmosClaim" },
        ],
      });

      const filteredTxs = txData.filter(tx => Number(tx.height) > height);
      if (filteredTxs.length > 0) {
        const txHashes: string[] = filteredTxs.map(tx => tx.hash);

        height = filteredTxs.reduce(
          (a, b) => {
            return Number(a.height) > Number(b.height) ? a : b;
          },
          { height: 0 }
        ).height;

        for (let i = 0; i < txHashes.length; i++) {
          const hash = txHashes[i];

          const res = await qClient.getTx(hash);
          const decodedRes = await qClient.decodeQryResponse(res);
          const txEventNonce: Long = decodedRes.tx.body.messages[0].eventNonce;

          if (nonce === `${txEventNonce.low}`) {
            result = hash;
            return result;
          }
        }
      }
      await new Promise(resolve => setTimeout(resolve, 5000));
    }

    return "";
  };

  renderContent() {
    return (
      <div>
        <div className={"HeaderSection"}>
          <div className={"Wrapper"}>
            <div
              className={"CudosMainLogo"}
              style={ProjectUtils.makeBgImgStyle(cudosMainLogo)}
            ></div>
          </div>
          <div className={"Header"}>CUDOS Bridge</div>
          <div className={"Wrapper"}>
            <span className={"TransferInfoBox"}>
              {this.state.selectedFromNetwork
                ? ProjectUtils.CUDOS_NETWORK_TEXT
                : ProjectUtils.ETHEREUM_NETWORK_TEXT}
            </span>
            <div className={"TransferWrapper"}>
              <span
                className={"TransferLogoAlt"}
                style={ProjectUtils.makeBgImgStyle(transferLogoAlt)}
              ></span>
            </div>
            <span className={"TransferInfoBox"}>
              {this.state.selectedToNetwork
                ? ProjectUtils.CUDOS_NETWORK_TEXT
                : ProjectUtils.ETHEREUM_NETWORK_TEXT}
            </span>
          </div>
          <div className={"Subheader"}>
            <div>
              Transfer tokens between {ProjectUtils.ETHEREUM_NETWORK_TEXT} and{" "}
              {ProjectUtils.CUDOS_NETWORK_TEXT}. Connect a{" "}
              {ProjectUtils.CUDOS_NETWORK_TEXT} and{" "}
              {ProjectUtils.ETHEREUM_NETWORK_TEXT} account to get started
            </div>
          </div>
        </div>
        <div className={!this.state.summary ? "PageContent" : "SummaryContent"}>
          <LoadingModal
            isOpen={this.state.isLoading}
            closeModal={() =>
              this.setState({ isTransactionFail: false, isOpen: false })
            }
            additionalText={this.state.loadingModalAdditionalText}
          />
          <SummaryModal
            getAddress={this.getAddress}
            displayAmount={this.state.displayAmount}
            selectedFromNetwork={this.state.selectedFromNetwork}
            selectedToNetwork={this.state.selectedToNetwork}
            txHash={this.state.txHash}
            destTxHash={this.state.destTxHash}
            closeModal={() =>
              this.setState({ isOpen: false, displayAmount: S.Strings.EMPTY })
            }
            isOpen={this.state.isOpen}
            onGetBalance={this.onGetBalance}
            checkWalletConnected={this.checkWalletConnected}
          />
          <FailureModal
            isOpen={this.state.isTransactionFail}
            closeModal={() =>
              this.setState({
                isTransactionFail: false,
                isOpen: false,
                displayAmount: S.Strings.EMPTY,
              })
            }
            errorMessage={this.state.errorMessage}
          />
          <PreFlightModal
            isOpen={this.state.preFlight}
            closeModal={() => this.executeTransaction()}
            rejectModal={() => this.setState({ preFlight: false })}
            transferAmount={this.state.preFlightAmount}
            fromAddress={this.state.preFlightFromAddress}
            toAddress={this.state.preFlightToAddress}
            selectedFromNetwork={this.state.selectedFromNetwork}
            selectedToNetwork={this.state.selectedToNetwork}
          />
          {!this.state.summary ? (
            <TransferForm
              selectedFromNetwork={this.state.selectedFromNetwork}
              selectedToNetwork={this.state.selectedToNetwork}
              isFromConnected={this.state.isFromConnected}
              isToConnected={this.state.isToConnected}
              onDisconnectFromNetwork={this.onDisconnectFromNetwork}
              onDisconnectToNetwork={this.onDisconnectToNetwork}
              onSelectFromNetwork={this.onSelectFromNetwork}
              onSelectToNetwork={this.onSelectToNetwork}
              onChnageTransactionDirection={this.onChnageTransactionDirection}
              getAddress={this.getAddress}
              goToTransactionSummary={this.goToTransactionSummary}
              onChangeAccount={this.onChangeAccount}
              checkWalletConnected={this.checkWalletConnected}
              connectWallet={this.connectWallet}
            />
          ) : (
            <SummaryForm
              selectedFromNetwork={this.state.selectedFromNetwork}
              selectedToNetwork={this.state.selectedToNetwork}
              isFromConnected={this.state.isFromConnected}
              isToConnected={this.state.isToConnected}
              contractBalance={this.state.contractBalance}
              walletBalance={this.state.walletBalance}
              displayAmount={this.state.displayAmount}
              onDisconnectFromNetwork={this.onDisconnectFromNetwork}
              onDisconnectToNetwork={this.onDisconnectToNetwork}
              onSelectFromNetwork={this.onSelectFromNetwork}
              onSelectToNetwork={this.onSelectToNetwork}
              onChnageTransactionDirection={this.onChnageTransactionDirection}
              getAddress={this.getAddress}
              onChangeAmount={this.onChangeAmount}
              onClickMaxAmount={this.onClickMaxAmount}
              onClickSend={this.onClickSend}
              isTransferring={this.state.isTransferring}
              minTransferAmount={this.state.minTransferAmount}
              minBridgeFeeAmount={this.state.minBridgeFeeAmount}
              estimatedGasFees={this.state.estimatedGasFees}
              validAmount={this.state.validAmount}
            />
          )}
          {this.state.summary ? null : (
            <div className={"CreateAccount"}>
              <span>
                Need a {ProjectUtils.CUDOS_NETWORK_TEXT} account? Create one{" "}
                <a
                  rel='noreferrer'
                  target='_blank'
                  style={{ color: "rgba(78, 148, 238, 1)" }}
                  href={keplrLink}
                >
                  here
                </a>
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }
}

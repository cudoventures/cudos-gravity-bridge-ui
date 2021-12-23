/* global TR */

import React, { RefObject } from 'react';

import ContextPageComponent, { ContextPageComponentProps } from './common/ContextPageComponent';
import TransferForm from './TransferForm';
import SummaryForm from './SummaryForm';
import SummaryModal from '../../../common/js/components-popups/SummaryModal';
import FailureModal from '../../../common/js/components-popups/FailureModal';

import Config from '../../../../../../builds/dev-generated/Config';
import './../../css/components-pages/cudos-bridge-component.css';
import PageComponent from '../../../common/js/components-pages/PageComponent';
import { inject, observer } from 'mobx-react';
import BigNumber from 'bignumber.js';

import S from '../../../common/js/utilities/Main';
import NetworkStore from '../../../common/js/stores/NetworkStore';
import KeplrLedger from '../../../common/js/models/ledgers/KeplrLedger';
import ProjectUtils from '../../../common/js/ProjectUtils';
import Ledger from '../../../common/js/models/ledgers/Ledger';
import CosmosNetworkH from '../../../common/js/models/ledgers/CosmosNetworkH';
import MetamaskLedger from '../../../common/js/models/ledgers/MetamaskLedger';
import Web3 from 'web3';
import ERC20TokenAbi from '../../../common/js/solidity/contract_interfaces/ERC20_token.json';

interface Props extends ContextPageComponentProps {
    networkStore: NetworkStore;
}

interface State {
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
    // showPopup: boolean;
    // popupType: string;
    // transactionPopupText: string;
    contractBalance: BigNumber;
    summary: boolean;
    isOpen: boolean;
    isTransferring: boolean;
    isTransactionFail: boolean
}

const cudosMainLogo = '../../../../resources/common/img/favicon/cudos-40x40.svg'
const cudosFont = '../../../../resources/common/img/favicon/cudos-font.svg'
const transferLogoAlt = '../../../../resources/common/img/favicon/transfer-logo-alt.svg'
// const POPUP_TYPE_ERROR = 'Error';
// const POPUP_TYPE_SUCCESS = 'Success';

export default class CudosBridgeComponent extends ContextPageComponent<Props, State> {

    inputTimeouts: any;
    root: RefObject<HTMLDivElement>;

    static layout() {
        const MobXComponent = inject('appStore', 'alertStore', 'networkStore')(observer(CudosBridgeComponent));
        PageComponent.layout(<MobXComponent />);
    }

    constructor(props: Props) {
        super(props);

        this.state = {
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
            // showPopup: false,
            // popupType: S.Strings.EMPTY,
            // transactionPopupText: S.Strings.EMPTY,
            contractBalance: new BigNumber(0),
            summary: false,
            isOpen: false,
            isTransactionFail: false,
            isTransferring: false,
        }

        this.root = React.createRef();

        this.inputTimeouts = {
            'amount': null,
            'destiantionAddress': null,
        }
    }

    async getContractBalance(): Promise<BigNumber> {
        try {

            const contractWallet = Config.ORCHESTRATOR.BRIDGE_CONTRACT_ADDRESS;
            const web3 = new Web3(Config.ETHEREUM.ETHEREUM_RPC);
            const erc20Contract = new web3.eth.Contract(ERC20TokenAbi, Config.ORCHESTRATOR.ERC20_CONTRACT_ADDRESS);

            const balance = await erc20Contract.methods.balanceOf(contractWallet).call();

            return (new BigNumber(balance)).div(CosmosNetworkH.CURRENCY_1_CUDO);
        } catch (e) {
            console.log(e);
            throw new Error('Failed to fetch balance!');
        }
    }

    getPageLayoutComponentCssClassName() {
        return 'CudosBridge';
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
            })
        }
    }

    onDisconnectToNetwork = async (): Promise<void> => {
        if (this.state.isToConnected) {
            this.setState({
                isToConnected: false,
            })
        }
    }

    onSelectFromNetwork = async (): Promise<void> => {
        let balance = new BigNumber(0);
        let ledger = null;
        const toNetwork = null;
        let fromNetwork = null;
        let contractBalance = new BigNumber(0);
        let connectionError = false;
        let account = null;

        try {
            fromNetwork = this.state.selectedFromNetwork;
            ledger = await this.connectWallet(fromNetwork);
            balance = await ledger.getBalance();
            account = localStorage.setItem('fromAccount', await ledger.account)
            if (this.isFromCosmos(fromNetwork) === true) {
                contractBalance = await this.getContractBalance();
            } else {
                contractBalance = new BigNumber(Number.MAX_SAFE_INTEGER);
            }
        } catch (e) {
            this.showAlertError(e.toString());
            connectionError = true
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
            })
        }
    }

    onSelectToNetwork = async (): Promise<void> => {
        let balance = new BigNumber(0);
        let ledger = null;
        let toNetwork = null;
        const fromNetwork = null;
        let contractBalance = new BigNumber(0);
        let connectionError = false;
        let account = null;

        try {
            toNetwork = this.state.selectedToNetwork;
            ledger = await this.connectWallet(toNetwork);
            balance = await ledger.getBalance();
            account = localStorage.setItem('toAccount', await ledger.account)
            if (this.isFromCosmos(toNetwork) === true) {
                contractBalance = await this.getContractBalance();
            } else {
                contractBalance = new BigNumber(Number.MAX_SAFE_INTEGER);
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
                // walletBalance: balance,
                // contractBalance,
            })
        }
    }

    onClickMaxAmount = async () => {
        const ledger = await this.checkWalletConnected();
        const balance = await ledger.getBalance();

        const maximumAmount = BigNumber.minimum(balance, this.state.contractBalance);
        this.setState({
            amount: maximumAmount,
            displayAmount: maximumAmount.toFixed(),
            walletBalance: balance,
        })
    }

    onGetBalance = async () => {
        const ledger = await this.checkWalletConnected();
        const balance = await ledger.getBalance();

        this.setState({
            walletBalance: balance,
        })
    }

    onChangeAmount = (amount: string) => {
        clearTimeout(this.inputTimeouts.amount);
        const bigAmount = new BigNumber(amount);

        this.setState({
            amount: bigAmount,
            displayAmount: amount,
            amountError: S.INT_FALSE,
        })

        this.inputTimeouts.amount = setTimeout(() => {
            if (amount === S.Strings.EMPTY) {
                return;
            }

            if (bigAmount.isNaN() || bigAmount.isLessThan(new BigNumber(1).dividedBy(CosmosNetworkH.CURRENCY_1_CUDO)) || bigAmount.isGreaterThan(BigNumber.minimum(this.state.walletBalance, this.state.contractBalance))) {
                this.setState({
                    amountError: S.INT_TRUE,
                })
            }
        }, 1000);
    }

    onChangeDestinationAddress = (address) => {
        clearTimeout(this.inputTimeouts.destiantionAddress);

        this.setState({
            destinationAddress: address,
            destiantionAddressError: S.INT_FALSE,
        })

        this.inputTimeouts.destiantionAddress = setTimeout(() => {
            if (address === S.Strings.EMPTY) {
                return;
            }

            if (!this.isAddressValid(this.state.destinationAddress)) {
                this.setState({
                    destiantionAddressError: S.INT_TRUE,
                })
            }

        }, 1000);
    }

    onClickSend = async () => {
        if (this.state.amount.isGreaterThan(this.state.walletBalance)) {
            this.showAlertError('Error: The amount you entered is more than what you have in your wallet.');
            return;
        }

        if (this.state.amountError === S.INT_TRUE) {
            this.showAlertError('Error: Please enter valid amount of tokens.');
            return;
        }

        if (this.state.destiantionAddressError === S.INT_TRUE) {
            this.showAlertError('Error: Please enter a valid destiantion address.');
            return;
        }

        try {
            this.props.appStore.disableActions();
            this.setState({ isTransferring: true })
            const ledger = await this.checkWalletConnected();
            await ledger.send(this.state.amount, this.getAddress(this.state.selectedToNetwork, 0));
            this.setState({ isOpen: true })
        } catch (e) {
            this.setState({ isTransactionFail: true });
        } finally {
            this.setState({
                amount: new BigNumber(0),
                isTransferring: false,
                amountError: S.INT_FALSE,
                destinationAddress: S.Strings.EMPTY,
                destiantionAddressError: S.INT_FALSE,
            });

            this.props.appStore.enableActions();
        }
    }

    onChnageTransactionDirection = async (): Promise<void> => {
        const toNetwork = this.state.selectedToNetwork;
        const fromNetwork = this.state.selectedFromNetwork;
        const toConnected = this.state.isToConnected;
        const fromConnected = this.state.isFromConnected;
        let balance = new BigNumber(0);
        let contractBalance = new BigNumber(0);
        let ledger = null;
        let connectionError = false;
        let toAccount = null;
        let fromAccount = null;

        if (!toConnected && !fromConnected) {
            toAccount = localStorage.getItem('');
            fromAccount = localStorage.getItem('');
        } else {
            toAccount = localStorage.getItem('toAccount');
            fromAccount = localStorage.getItem('fromAccount');
        }

        try {
            const networkId = toNetwork;
            ledger = this.props.networkStore.networkHolders[networkId].ledger;

            if (toConnected) {
                balance = await ledger.getBalance();
            }
            if (this.isFromCosmos(toNetwork) === true) {
                contractBalance = await this.getContractBalance();
            } else {
                contractBalance = new BigNumber(Number.MAX_SAFE_INTEGER);
            }
        } catch (e) {
            this.showAlertError(e.toString());
            connectionError = true;
            balance = new BigNumber(0);
            contractBalance = new BigNumber(0);
        }

        if (!connectionError) {
            localStorage.setItem('fromAccount', toAccount);
            localStorage.setItem('toAccount', fromAccount);
            this.setState({
                displayAmount: S.Strings.EMPTY,
                selectedFromNetwork: toNetwork,
                selectedToNetwork: fromNetwork,
                isToConnected: fromConnected,
                isFromConnected: toConnected,
                walletBalance: balance,
                contractBalance,
            })
        }

    }

    checkWalletConnected = async () => {
        const networkId = this.state.selectedFromNetwork;
        const ledger = this.props.networkStore.networkHolders[networkId].ledger;

        if (!ledger.connected) {
            await this.connectWallet(this.state.selectedFromNetwork);
        }

        return ledger;
    }

    connectWallet = async (networkId: number): Promise<Ledger> => {
        const networkHolders = this.props.networkStore.networkHolders;

        const ledger = networkHolders[networkId].ledger;
        await ledger.connect();

        return ledger;
    }

    onChangeAccount = async (): Promise<void> => {
        const toNetwork = this.state.selectedToNetwork;
        const fromNetwork = this.state.selectedFromNetwork;
        const toConnected = this.state.isToConnected;
        const fromConnected = this.state.isFromConnected;
        let balance = new BigNumber(0);
        let contractBalance = new BigNumber(0);
        let ledger = null;
        let connectionError = false;
        let toAccount = null;
        let fromAccount = null;

        if (!toConnected && !fromConnected) {
            toAccount = localStorage.getItem('');
            fromAccount = localStorage.getItem('');
        } else {
            toAccount = localStorage.getItem('toAccount');
            fromAccount = localStorage.getItem('fromAccount');
        }

        try {
            ledger = this.props.networkStore.networkHolders[fromNetwork].ledger;

            if (fromConnected) {
                balance = await ledger.getBalance();
            }
            if (this.isFromCosmos(fromNetwork) === true) {
                contractBalance = await this.getContractBalance();
            } else {
                contractBalance = new BigNumber(Number.MAX_SAFE_INTEGER);
            }
        } catch (e) {
            this.showAlertError(e.toString());
            connectionError = true;
            balance = new BigNumber(0);
            contractBalance = new BigNumber(0);
        }

        if (!connectionError) {
            localStorage.setItem('fromAccount', toAccount);
            localStorage.setItem('toAccount', fromAccount);
            this.setState({
                displayAmount: S.Strings.EMPTY,
                selectedFromNetwork: fromNetwork,
                selectedToNetwork: toNetwork,
                isToConnected: toConnected,
                isFromConnected: fromConnected,
                walletBalance: balance,
                contractBalance,
            })
        }
    }

    showAlertError(msg) {
        this.props.alertStore.show((
            <div className={'Error'}>{msg}</div>
        ));
    }

    showAlertSuccess(msg) {
        this.props.alertStore.show((
            <div className={'Success'}>{msg}</div>
        ));
    }

    isAddressValid = (address) => {
        const ledger = this.props.networkStore.networkHolders[this.state.selectedToNetwork].ledger;

        return ledger.isAddressValid(address);
    }

    getLogoName = (network) => {
        if (network) {
            return `${network.name.toLowerCase()}-logo.png`;
        }

        return '';
    }

    getAddress = (networkId: number, sliceIndex: number): string => {
        try {
            const ledger = this.props.networkStore.networkHolders[networkId].ledger
            if (sliceIndex === 0) {
                return ledger.account;
            }
            return this.formatText(ledger.account, sliceIndex);
        } catch (e) {
            this.showAlertError(e.toString());
        }
    }

    formatText(text: string, sliceIndex: number): string {
        if (!text) {
            return (null);
        }
        const len = text.length
        if ((text === null || text.length < 10)) {
            return text
        }
        return `${text.slice(0, sliceIndex)}...${text.slice(len - 4, len)}`
    }

    goToTransactionSummary = (): void => {
        this.setState({
            summary: true,
        })
    }

    renderContent() {
        return (
            <div>
                <div className={'HeaderSection'}>
                    <div className={'Wrapper'}>
                        <div className={'CudosMainLogo'} style={ProjectUtils.makeBgImgStyle(cudosMainLogo)}></div>
                    </div>
                    <div className={'Wrapper'}>
                        <div className={'CudosFont'} style={ProjectUtils.makeBgImgStyle(cudosFont)}></div>
                    </div>
                    <div className={'Header'} >Gravity Bridge</div>
                    <div className={'Wrapper'}>
                        <span className={'TransferInfoBox'}>{this.state.selectedFromNetwork ? 'CUDOS' : 'Ethereum'}</span>
                        <div className={'TransferWrapper'}>
                            <span className={'TransferLogoAlt'} style={ProjectUtils.makeBgImgStyle(transferLogoAlt)}></span>
                        </div>
                        <span className={'TransferInfoBox'}>{this.state.selectedToNetwork ? 'CUDOS' : 'Ethereum'}</span>
                    </div>
                    <div className={'Subheader'}>
                        <div>Transfer tokens between Ethereum and CUDOS. Connect a CUDOS and Ethereum account to get started</div>
                    </div>
                </div>
                <div className={!this.state.summary ? 'PageContent' : 'SummaryContent'}>
                    <SummaryModal
                        getAddress={this.getAddress}
                        displayAmount={this.state.displayAmount}
                        selectedFromNetwork={this.state.selectedFromNetwork}
                        selectedToNetwork={this.state.selectedToNetwork}
                        closeModal={() => this.setState({ isOpen: false, displayAmount: S.Strings.EMPTY })}
                        isOpen={this.state.isOpen}
                        onGetBalance={this.onGetBalance}
                    />
                    <FailureModal
                        isOpen={this.state.isTransactionFail}
                        closeModal={() => this.setState({ isTransactionFail: false, isOpen: false, displayAmount: S.Strings.EMPTY })}
                    />
                    {!this.state.summary
                        ? <TransferForm
                            selectedFromNetwork={this.state.selectedFromNetwork}
                            selectedToNetwork={this.state.selectedToNetwork}
                            isFromConnected = {this.state.isFromConnected}
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
                        />
                        : <SummaryForm
                            selectedFromNetwork={this.state.selectedFromNetwork}
                            selectedToNetwork={this.state.selectedToNetwork}
                            isFromConnected = {this.state.isFromConnected}
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
                        />
                    }
                    {this.state.summary
                        ? null
                        : <div className={'CreateAccount'}>
                            <span>Need a CUDOS account? Create one <a target='_blank' style={{ color: 'rgba(78, 148, 238, 1)' }} href='https://www.google.bg/'>here</a></span>
                        </div>
                    }
                </div>
            </div>
        )
    }

}

/* global TR */

import React, { RefObject } from 'react';

import ContextPageComponent, { ContextPageComponentProps } from './common/ContextPageComponent';

import Config from '../../../../../../builds/dev-generated/Config';
import './../../css/components-pages/cudos-bridge-component.css';
import LayoutBlock from '../../../common/js/components-inc/LayoutBlock';
import Button from '../../../common/js/components-inc/Button';
import Input from '../../../common/js/components-inc/Input';
import Select from '../../../common/js/components-inc/Select';
import Popover from '../../../common/js/components-inc/Popover';
import PageComponent from '../../../common/js/components-pages/PageComponent';
import { inject, observer } from 'mobx-react';
import BigNumber from 'bignumber.js';
import SvgArrowRight from '../../../common/svg/arrow-right.svg';

import S from '../../../common/js/utilities/Main';
import NetworkStore from '../../../common/js/stores/NetworkStore';
import KeplrLedger from '../../../common/js/models/ledgers/KeplrLedger';
import ProjectUtils from '../../../common/js/ProjectUtils';
import { MenuItem } from '@material-ui/core';
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
}

const cudosLogo = '../../../../resources/common/img/favicon/cudos-22x22.svg'
const cudosMainLogo = '../../../../resources/common/img/favicon/cudos-40x40.svg'
const ethLogo = '../../../../resources/common/img/favicon/eth-16x25.png'
const transferLogo = '../../../../resources/common/img/favicon/transfer-logo.svg'
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
        console.log('isCosmos', ledger);
        
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

    onDisconnectFromNetwork = async () => {
        if (this.state.isFromConnected) {
            this.setState({
                isFromConnected: false
            })
        }
    }

    onDisconnectToNetwork = async (networkId: number = null) => {
        if (this.state.isToConnected) {
            this.setState({
                isToConnected: false,
            })
        }
    }

    onSelectFromNetwork = async (value: number) => {
        let balance = new BigNumber(0);
        let ledger = null;
        let toNetwork = null;
        let fromNetwork = null;
        let contractBalance = new BigNumber(0);

        try {
            fromNetwork = value;
            ledger = await this.connectWallet(value);
            // toNetwork = this.props.networkStore.networkHolders.findIndex((v, i) => i !== value);
            balance = await ledger.getBalance();
            if (this.isFromCosmos(fromNetwork) === true) {
                contractBalance = await this.getContractBalance();
            } else {
                contractBalance = new BigNumber(Number.MAX_SAFE_INTEGER);
            }
        } catch (e) {
            this.showAlertError(e.toString());
            fromNetwork = S.NOT_EXISTS;
            ledger = null;
            balance = new BigNumber(0);
            // toNetwork = S.NOT_EXISTS;
            contractBalance = new BigNumber(0);
        }

        this.setState({
            selectedFromNetwork: fromNetwork,
            isFromConnected: true,
            // selectedToNetwork: toNetwork,
            amount: new BigNumber(0),
            displayAmount: S.Strings.EMPTY,
            amountError: S.INT_FALSE,
            destinationAddress: S.Strings.EMPTY,
            destiantionAddressError: S.INT_FALSE,
            walletBalance: balance,
            contractBalance,
        })
    }

    onSelectToNetwork = async (value) => {
        let balance = new BigNumber(0);
        let ledger = null;
        let toNetwork = null;
        let fromNetwork = null;
        let contractBalance = new BigNumber(0);

        try {
            toNetwork = value;
            // fromNetwork = `${this.props.networkStore.networkHolders.findIndex((v, i) => i !== value)}`;
            ledger = await this.connectWallet(toNetwork);
            balance = await ledger.getBalance();
            if (this.isFromCosmos(toNetwork) === true) {
                contractBalance = await this.getContractBalance();
            } else {
                contractBalance = new BigNumber(Number.MAX_SAFE_INTEGER);
            }
        } catch (e) {
            this.showAlertError(e.toString());
            // fromNetwork = S.NOT_EXISTS;
            ledger = null;
            balance = new BigNumber(0);
            toNetwork = S.NOT_EXISTS;
            contractBalance = new BigNumber(0);
        }

        this.setState({
            // selectedFromNetwork: fromNetwork,
            selectedToNetwork: toNetwork,
            isToConnected: true,
            amount: new BigNumber(0),
            displayAmount: S.Strings.EMPTY,
            amountError: S.INT_FALSE,
            destinationAddress: S.Strings.EMPTY,
            destiantionAddressError: S.INT_FALSE,
            walletBalance: balance,
            contractBalance,
        })
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

            const ledger = await this.checkWalletConnected();
            await ledger.send(this.state.amount, this.state.destinationAddress);
            // await ledger.requestBatch();
            this.showAlertSuccess('Your transaction was sent successfully and will be executed in next 60 blocks');
        } catch (e) {
            this.showAlertError(e.toString());
        } finally {
            this.setState({
                amount: new BigNumber(0),
                displayAmount: S.Strings.EMPTY,
                amountError: S.INT_FALSE,
                destinationAddress: S.Strings.EMPTY,
                destiantionAddressError: S.INT_FALSE,
            });

            this.props.appStore.enableActions();
        }
    }

    onChnageTransactionDirection = async () => {
        const toNetwork = this.state.selectedToNetwork;
        const fromNetwork = this.state.selectedFromNetwork;
        this.setState({
            selectedFromNetwork: toNetwork,
            selectedToNetwork: fromNetwork
        })
    }

    checkWalletConnected = async () => {
        const networkId = this.state.selectedFromNetwork;
        const ledger = this.props.networkStore.networkHolders[networkId].ledger;

        if (!ledger.connected) {
            await this.connectWallet(this.state.selectedFromNetwork);
        }

        return ledger;
    }

    checkBothWalletsConnected = async () => {
        const keplrLedger = this.props.networkStore.networkHolders[1].ledger;
        console.log('keplr', keplrLedger);

        const metamaskLedger = this.props.networkStore.networkHolders[0].ledger;
        console.log('meta', metamaskLedger);
        if (!keplrLedger && !metamaskLedger) {
            return false;
        } else {
            return true;
        }
    }

    // onClickConnectWallet = async () => {
    //     const networkId = this.state.selectedFromNetwork;

    //     this.connectWallet(networkId);
    // }

    connectWallet = async (networkId: number): Promise<Ledger> => {
        const networkHolders = this.props.networkStore.networkHolders;

        const ledger = networkHolders[networkId].ledger;
        console.log('ledger', ledger);


        if (!ledger.connected) {
            await ledger.connect();
        }

        return ledger;
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

    getAddress = (networkId: number) => {
        const ledger = this.props.networkStore.networkHolders[networkId].ledger
        return this.formatText(ledger.account);
    }

    formatText (text: string): string {
        if ((text === null || text.length < 10)) {
          return text
        } else {
          const len = text.length
            return text.slice(0, 19) + '...' + text.slice(len - 4, len)
        }
      }

    // toggleOpenState = () => {
    //     this.setState({
    //         showPopup: !this.state.showPopup,
    //     })
    // }

    // onClickClosePopup = () => {
    //     this.setState({
    //         showPopup: false,
    //         transactionPopupText: S.Strings.EMPTY,
    //     })
    // }

    renderContent() {
        return (
            <div className={'PageContent'}>
                {/* <Popover
                    anchorOrigin={{ vertical: 'center', horizontal: 'center' }}
                    transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                    onClose={this.toggleOpenState}
                    open={this.state.showPopup}
                    anchorEl={this.root.current}>
                    <div className = { 'FlexColumn TransactionPopover' }>
                        <div className = { `PopupText ${this.state.popupType}` }>
                            {this.state.transactionPopupText}
                        </div>
                        <Button
                            type = { Button.TYPE_ROUNDED }
                            color = { Button.COLOR_SCHEME_1 }
                            onClick = { this.onClickClosePopup }>Okay</Button>
                    </div>
                </Popover> */}
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
                <div className={'SendForm'} >
                    <div className={'Title'}>Transfer from</div>
                    <div className={'Address'}>
                        <div className={this.state.selectedFromNetwork ? 'CudosLogo' : 'EthLogo'} style={this.state.selectedFromNetwork ? ProjectUtils.makeBgImgStyle(cudosLogo) : ProjectUtils.makeBgImgStyle(ethLogo)} />
                        {this.state.isFromConnected ? this.getAddress(this.state.selectedFromNetwork) : this.state.selectedFromNetwork ? 'CUDOS' : 'Ethereum'}
                        <Button
                            className={this.state.isFromConnected ? 'DisconnectBtn' : 'ConnectBtn'}
                            onClick={() => this.state.isFromConnected ? this.onDisconnectFromNetwork() : this.onSelectFromNetwork(this.state.selectedFromNetwork)}
                            // value = { this.state.selectedFromNetwork }
                            type={Button.TYPE_ROUNDED}
                            color={this.state.isFromConnected ? Button.COLOR_SCHEME_2 : Button.COLOR_SCHEME_1}>{this.state.isFromConnected ? 'Disconnect' : 'Connect'}</Button>
                    </div>
                    <div className={'Wrapper'}>
                        <div className={'TransferLogo'} style={ProjectUtils.makeBgImgStyle(transferLogo)} onClick={() => this.onChnageTransactionDirection()}></div>
                    </div>
                    <div className={'Title'}>Transfer to</div>
                    <div className={'Address'}>
                    <div className={this.state.selectedToNetwork ? 'CudosLogo' : 'EthLogo'} style={this.state.selectedToNetwork ? ProjectUtils.makeBgImgStyle(cudosLogo) : ProjectUtils.makeBgImgStyle(ethLogo)} />
                        {this.state.isToConnected ? this.getAddress(this.state.selectedToNetwork) : this.state.selectedToNetwork ? 'CUDOS' : 'Ethereum'}
                        <Button
                            className={this.state.isToConnected ? 'DisconnectBtn' : 'ConnectBtn'}
                            onClick={() => this.state.isToConnected ? this.onDisconnectToNetwork() : this.onSelectToNetwork(this.state.selectedToNetwork)}
                            value={this.state.selectedToNetwork}
                            type={Button.TYPE_ROUNDED}
                            color={this.state.isToConnected ? Button.COLOR_SCHEME_2 : Button.COLOR_SCHEME_1}>{this.state.isToConnected ? 'Disconnect' : 'Connect'}</Button>
                    </div>
                    <div className={'FormRow Wrapper'} >
                        <Button
                            disabled={(!this.state.isFromConnected || !this.state.isToConnected)}
                            className={'TransferBtn'}
                            type={Button.TYPE_ROUNDED}
                            color={Button.COLOR_SCHEME_1}
                            onClick={this.onClickSend}>Begin new transfer
                        </Button>
                    </div>
                    {/* <div ref={this.root} className = { 'FlexRow FormRow NetworkSelectMenu' }>
                        <div className = { 'NetworkSelectContainer FlexColumn' }>
                            <div className={ 'NetworkLogo' } style={ProjectUtils.makeBgImgStyle(this.state.selectedFromNetwork !== S.NOT_EXISTS ? `${Config.URL.Resources.Common.IMG}/${this.getLogoName(this.props.networkStore.networkHolders[this.state.selectedFromNetwork])}` : '')}></div>
                            <div className = { 'DirectionText' }>FROM</div>
                            <Select
                                className = { 'NetworkSelect' }
                                onChange = { this.onSelectFromNetwork }
                                value = { this.state.selectedFromNetwork }>
                                {this.props.networkStore.networkHolders.map((network, i) => <MenuItem key = { i } value = { i } >{ network.name }</MenuItem>)}
                            </Select>
                        </div>
                        <div className={'SVG Icon'} dangerouslySetInnerHTML={{ __html: SvgArrowRight }}></div>
                        <div className = { 'NetworkSelectContainer FlexColumn' }>
                            <div className={ 'NetworkLogo' } style={ProjectUtils.makeBgImgStyle(this.state.selectedToNetwork !== S.NOT_EXISTS ? `${Config.URL.Resources.Common.IMG}/${this.getLogoName(this.props.networkStore.networkHolders[this.state.selectedToNetwork])}` : '')}></div>
                            <div className = { 'DirectionText' }>TO</div>
                            <Select
                                className = { 'NetworkSelect' }
                                onChange = { this.onSelectToNetwork }
                                value = { this.state.selectedToNetwork }>
                                {this.props.networkStore.networkHolders.map((network, i) => <MenuItem key = { i } value = { i } >{ network.name }</MenuItem>)}
                            </Select>
                        </div>
                    </div>
                    <LayoutBlock className = { 'FlexColumn FormRow' }>
                        <Input
                            label = { 'Amount' }
                            value = {this.state.displayAmount}
                            onChange = { this.onChangeAmount }
                            InputProps = {{
                                endAdornment: <div className = {' FlexRow Adornment'}>
                                    <div className={this.state.selectedToNetwork === S.NOT_EXISTS ? 'Mui-disabled' : ''}>CUDOS</div>
                                    <Button disabled = {this.state.selectedToNetwork === S.NOT_EXISTS}
                                        className = {' InInput '}
                                        type = { Button.TYPE_ROUNDED }
                                        color = { Button.COLOR_SCHEME_1 }
                                        onClick = { this.onClickMaxAmount }>Max</Button>
                                </div> }}
                            error = { this.state.amountError === S.INT_TRUE}/>
                        { this.isFromCosmos() && (
                            <div className = { 'ContractBalance' }>{`Bridge contract balance is: ${this.state.contractBalance.toFixed()} CUDOS`}</div>
                        ) }
                    </LayoutBlock>
                    <LayoutBlock className = { 'FormRow' }>
                        <Input
                            label = { 'Destination address' }
                            value = {this.state.destinationAddress}
                            onChange = { this.onChangeDestinationAddress }
                            error = { this.state.destiantionAddressError === S.INT_TRUE}/>
                    </LayoutBlock>
                    <LayoutBlock className = { 'FormRow' } >
                        {this.state.selectedToNetwork !== S.NOT_EXISTS
                        && <Button
                            type = { Button.TYPE_ROUNDED }
                            color = { Button.COLOR_SCHEME_1 }
                            onClick = { this.onClickSend }>Send</Button>}
                    </LayoutBlock> */}
                </div>
                <div className={'CreateAccount'}>
                    <span>Need a CUDOS account? Create one <a target='_blank' style={{ color: 'rgba(78, 148, 238, 1)' }} href='https://www.google.bg/'>here</a></span>
                </div>
            </div>
        )
    }

}

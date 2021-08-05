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
    selectedFromNetwork: string;
    selectedToNetwork: string;
    amount: BigNumber;
    displayAmount: string;
    walletBalance: BigNumber;
    amountError: number;
    destinationAddress: string;
    destiantionAddressError: number;
    showPopup: boolean;
    popupType: string;
    transactionPopupText: string;
    contractBalance: BigNumber;
}

const POPUP_TYPE_ERROR = 'Error';
const POPUP_TYPE_SUCCESS = 'Success';

export default class CudosBridgeComponent extends ContextPageComponent < Props, State > {

    inputTimeouts: any;
    root: RefObject<HTMLDivElement>;

    static layout() {
        const MobXComponent = inject('appStore', 'networkStore')(observer(CudosBridgeComponent));
        PageComponent.layout(<MobXComponent />);
    }

    constructor(props: Props) {
        super(props);
        
        this.state = {
            selectedFromNetwork: S.Strings.EMPTY,
            selectedToNetwork: S.Strings.EMPTY,
            amount: new BigNumber(0),
            displayAmount: S.Strings.EMPTY,
            walletBalance: new BigNumber(0),
            amountError: S.INT_FALSE,
            destinationAddress: S.Strings.EMPTY,
            destiantionAddressError: S.INT_FALSE,
            showPopup: false,
            popupType: S.Strings.EMPTY,
            transactionPopupText: S.Strings.EMPTY,
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

            return (new BigNumber(balance)).div(10 ** CosmosNetworkH.CURRENCY_DECIMALS);
        } catch (e) {
            console.log(e);
            throw new Error('Failed to fetch balance!');
        }
    }
    
    getPageLayoutComponentCssClassName() {
        return 'CudosBridge';
    }

    onSelectFromNetwork = async (value) => {
        let balance = new BigNumber(0);
        let ledger = null;
        let toNetwork = null;
        let fromNetwork = null;
        let contractBalance = new BigNumber(0);

        try {
            fromNetwork = value;
            ledger = await this.connectWallet(value);
            toNetwork = this.props.networkStore.networkHolders.findIndex((v, i) => i !== value);
            balance = await ledger.getBalance(this.showErrorPopup);
            contractBalance = await this.getContractBalance();
        } catch (e) {
            this.showErrorPopup(e);
            fromNetwork = S.Strings.EMPTY;
            ledger = null;
            balance = new BigNumber(0);
            toNetwork = null;
            contractBalance = new BigNumber(0);

        }

        this.setState({
            selectedFromNetwork: `${fromNetwork}`,
            selectedToNetwork: `${toNetwork}`,
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
            fromNetwork = `${this.props.networkStore.networkHolders.findIndex((v, i) => i !== value)}`;
            ledger = await this.connectWallet(fromNetwork);
            balance = await ledger.getBalance(this.showErrorPopup);
            contractBalance = await this.getContractBalance();
            toNetwork = value;
        } catch (e) {
            this.showErrorPopup(e);
            fromNetwork = S.Strings.EMPTY;
            ledger = null;
            balance = new BigNumber(0);
            toNetwork = null;
            contractBalance = new BigNumber(0);
        }

        this.setState({
            selectedFromNetwork: fromNetwork,
            selectedToNetwork: toNetwork,
            amount: new BigNumber(0),
            displayAmount: S.Strings.EMPTY,
            amountError: S.INT_FALSE,
            destinationAddress: S.Strings.EMPTY,
            destiantionAddressError: S.INT_FALSE,
            walletBalance: balance,
            contractBalance,
        })
    }

    onClickMaxAmount = () => {
        const maximumAmount = BigNumber.minimum(this.state.walletBalance, this.state.contractBalance);
        this.setState({
            amount: maximumAmount,
            displayAmount: maximumAmount.toFixed(),
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

            if (bigAmount.isNaN() || bigAmount.isLessThan(new BigNumber(1).dividedBy(10 ** CosmosNetworkH.CURRENCY_DECIMALS)) || bigAmount.isGreaterThan(BigNumber.minimum(this.state.walletBalance, this.state.contractBalance))) {
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
            this.showErrorPopup('Error: The amount you entered is more than what you have in your walled.');
            return;
        }

        if (this.state.amountError === S.INT_TRUE) {
            this.showErrorPopup('Error: Please enter valid amount of tokens.');
            return;
        }

        if (this.state.destiantionAddressError === S.INT_TRUE) {
            this.showErrorPopup('Error: Please enter a valid destiantion address.');
            return;
        }

        try {
            const ledger = await this.checkWalletConnected();
            await ledger.send(this.state.amount, this.state.destinationAddress, this.showSuccessPopup, this.showErrorPopup);
        } catch (e) {
            this.showErrorPopup(e);
        }
    }

    onClickRequestBatch = async () => {
        try {
            const ledger = await this.checkWalletConnected();
            await ledger.requestBatch(this.showSuccessPopup, this.showErrorPopup);
        } catch (e) {
            this.showErrorPopup(e);
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

    onClickConnectWallet = async () => {
        const networkId = this.state.selectedFromNetwork;

        this.connectWallet(networkId);
    }

    connectWallet = async (networkId: string): Promise<Ledger> => {
        const networkHolders = this.props.networkStore.networkHolders;

        const ledger = networkHolders[networkId].ledger;

        if (ledger.connected) {
            return ledger;
        }

        const newLedger = networkHolders[networkId].ledger;

        await newLedger.connect(window, this.showSuccessPopup, this.showErrorPopup);

        return newLedger;
    }

    showErrorPopup = (error) => {
        this.setState({
            showPopup: true,
            transactionPopupText: error.toString(),
            popupType: POPUP_TYPE_ERROR,
        })
    }

    showSuccessPopup = (message) => {
        this.setState({
            showPopup: true,
            transactionPopupText: message,
            popupType: POPUP_TYPE_SUCCESS,
        })
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

    toggleOpenState = () => {
        this.setState({
            showPopup: !this.state.showPopup,
        })
    }

    onClickClosePopup = () => {
        this.setState({
            showPopup: false,
            transactionPopupText: S.Strings.EMPTY,
        })
    }

    renderContent() {
        return (
            <div className = { 'PageContent' }>
                <Popover
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
                </Popover>
                <div className = { 'FormRow Header' } >
                    <div><span className = { 'NetworkName' }>Cudos</span> Bridge</div>
                </div>
                <div className = { 'SendForm' } >
                    <h3>Send CUDOS</h3>
                    <div ref={this.root} className = { 'FlexRow FormRow NetworkSelectMenu' }>
                        <div className = { 'NetworkSelectContainer FlexColumn' }>
                            <div className={ 'NetworkLogo' } style={ProjectUtils.makeBgImgStyle(this.state.selectedFromNetwork !== S.Strings.EMPTY ? `${Config.URL.Resources.Common.IMG}/${this.getLogoName(this.props.networkStore.networkHolders[this.state.selectedFromNetwork])}` : '')}></div>
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
                            <div className={ 'NetworkLogo' } style={ProjectUtils.makeBgImgStyle(this.state.selectedToNetwork !== S.Strings.EMPTY ? `${Config.URL.Resources.Common.IMG}/${this.getLogoName(this.props.networkStore.networkHolders[this.state.selectedToNetwork])}` : '')}></div>
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
                                    <div className={this.state.selectedToNetwork === S.Strings.EMPTY ? 'Mui-disabled' : ''}>CUDOS</div>
                                    <Button disabled = {this.state.selectedToNetwork === S.Strings.EMPTY}
                                        className = {' InInput '}
                                        type = { Button.TYPE_ROUNDED }
                                        color = { Button.COLOR_SCHEME_1 }
                                        onClick = { this.onClickMaxAmount }>Max</Button>
                                </div> }}
                            error = { this.state.amountError === S.INT_TRUE}/>
                        <div className = { 'ContractBalance' }>{`Bridge contract balance is: ${this.state.contractBalance.toFixed()} CUDOS`}</div>
                    </LayoutBlock>
                    <LayoutBlock className = { 'FormRow' }>
                        <Input
                            label = { 'Destination address' }
                            value = {this.state.destinationAddress}
                            onChange = { this.onChangeDestinationAddress }
                            error = { this.state.destiantionAddressError === S.INT_TRUE}/>
                    </LayoutBlock>
                    <LayoutBlock className = { 'FormRow' } >
                        {this.state.selectedToNetwork !== S.Strings.EMPTY
                        && <Button
                            type = { Button.TYPE_ROUNDED }
                            color = { Button.COLOR_SCHEME_1 }
                            onClick = { this.onClickSend }>Send</Button>}
                        {this.state.selectedFromNetwork !== S.Strings.EMPTY && this.props.networkStore.networkHolders[this.state.selectedFromNetwork].name === KeplrLedger.NETWORK_NAME
                        && <Button
                            type = { Button.TYPE_ROUNDED }
                            color = { Button.COLOR_SCHEME_1 }
                            onClick = { this.onClickRequestBatch }>Request Batch</Button>}
                    </LayoutBlock>
                </div>
            </div>
        )
    }

}

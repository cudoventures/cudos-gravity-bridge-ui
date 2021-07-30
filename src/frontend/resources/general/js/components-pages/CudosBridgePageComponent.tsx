/* global TR */

import React from 'react';

import ContextPageComponent, { ContextPageComponentProps } from './common/ContextPageComponent';

import './../../css/components-pages/cudos-bridge-component.css';
import LayoutBlock from '../../../common/js/components-inc/LayoutBlock';
import Actions from '../../../common/js/components-inc/Actions';
import Button from '../../../common/js/components-inc/Button';
import Checkbox from '../../../common/js/components-inc/Checkbox';
import Input from '../../../common/js/components-inc/Input';
import Select from '../../../common/js/components-inc/Select';
import SelectSearchable from '../../../common/js/components-inc/SelectSearchable';
import Tooltip from '../../../common/js/components-inc/Tooltip';
import Popover from '../../../common/js/components-inc/Popover';
import DatepickerComponent from '../../../common/js/components-core/Datepicker';
import { MenuItem } from '@material-ui/core';
import PageComponent from '../../../common/js/components-pages/PageComponent';
import { inject, observer } from 'mobx-react';
import BigNumber from 'bignumber.js';
import SvgArrowRight from '../../../common/svg/arrow-right.svg';

import S from '../../../common/js/utilities/Main';
import NetworkStore from '../../../common/js/stores/NetworkStore';
import KeplrLedger from '../../../common/js/models/ledgers/KeplrLedger';

interface Props extends ContextPageComponentProps {
    networkStore: NetworkStore;
}

interface State {
    selectedFromNetwork: string,
    selectedToNetwork: string,
    amount: BigNumber,
    displayAmount: string
    maxAmount: BigNumber,
    amountError: number,
    destinationAddress: string,
    destiantionAddressError: number,
}

export default class CudosBridgeComponent extends ContextPageComponent < Props, State > {

    inputTimeouts: any;

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
            maxAmount: new BigNumber(0),
            amountError: S.INT_FALSE,
            destinationAddress: S.Strings.EMPTY,
            destiantionAddressError: S.INT_FALSE,
        }

        this.inputTimeouts = {
            'amount': null,
            'destiantionAddress': null,
        }
    }

    getPageLayoutComponentCssClassName() {
        return 'CudosBridge';
    }

    onSelectFromNetwork = async (value) => {
        const ledger = this.props.networkStore.networkHolders[value].ledger;
        await ledger.connect();

        this.setState({
            selectedFromNetwork: value,
            selectedToNetwork: S.Strings.EMPTY,
            maxAmount: await ledger.getBalance(),
        })
    }

    onSelectToNetwork = (value) => {
        this.setState({
            selectedToNetwork: value,
        })
    }

    onClickMaxAmount = () => {
        // TODO: get max amount on account
        this.setState({
            amount: this.state.maxAmount,
            displayAmount: this.state.maxAmount.toString(),
        })
    }

    onChangeAmount = (amount: string) => {
        const bigAmount = new BigNumber(amount);

        this.setState({
            amount: bigAmount,
            displayAmount: amount,
            amountError: S.INT_FALSE,
        })

        clearTimeout(this.inputTimeouts.amount);
        this.inputTimeouts.destiantionAddress = setTimeout(() => {
            if (!bigAmount || bigAmount.comparedTo(this.state.maxAmount) === 1) {
                this.setState({
                    amountError: S.INT_TRUE,
                })
            }
        }, 1000);
    }

    onChangeDestinationAddress = (address) => {
        this.setState({
            destinationAddress: address,
            destiantionAddressError: S.INT_FALSE,
        })

        clearTimeout(this.inputTimeouts.destiantionAddress);

        this.inputTimeouts.destiantionAddress = setTimeout(() => {
            if (!this.isAddressValid(this.state.destinationAddress)) {

                this.setState({
                    destiantionAddressError: S.INT_TRUE,
                })
            }

        }, 1000);
    }

    onClickSend = async () => {
        const ledger = await this.checkWalletConnected();

        try {
            ledger.send(this.state.amount, this.state.destinationAddress);
        } catch (e) {
            console.log(e);
        }
    }

    onClickRequestBatch = async () => {
        const ledger = await this.checkWalletConnected();

        try {
            ledger.requestBatch();
        } catch (e) {
            console.log(e);
        }
    }

    checkWalletConnected = async () => {
        const networkId = this.state.selectedFromNetwork;
        const ledger = this.props.networkStore.networkHolders[networkId].ledger;

        if (!ledger.connected) {
            await this.connectWallet(networkId);
        }

        return ledger;
    }

    onClickConnectWallet = async () => {
        const networkId = this.state.selectedFromNetwork;

        this.connectWallet(networkId);
    }

    connectWallet = async (networkId: string) => {
        const networkHolders = this.props.networkStore.networkHolders;

        const ledger = networkHolders[networkId].ledger;

        if (ledger.connected) {
            return;
        }

        try {
            const newLedger = networkHolders[networkId].ledger;

            await newLedger.connect(window);

        } catch (e) {
            console.log(e);
        }
    }

    isAddressValid = (address) => {
        const ledger = this.props.networkStore.networkHolders[this.state.selectedToNetwork].ledger;

        return ledger.isAddressValid(address);
    }

    renderContent() {
        return (
            <LayoutBlock className = { 'PageContent' } direction = { LayoutBlock.DIRECTION_COLUMN}>
                <LayoutBlock className = { 'FormRow Header' } >
                    <div><span className = { 'NetworkName' }>Cudos</span> Bridge</div>
                </LayoutBlock>
                <LayoutBlock className = { 'SendForm' } >
                    <h3>Send</h3>
                    <LayoutBlock direction = { LayoutBlock.DIRECTION_ROW } className = { 'FormRow NetworkSelectMenu' }>
                        <LayoutBlock className = { 'NetworkSelect' }>
                            <h3>From</h3>
                            <Select
                                onChange = { this.onSelectFromNetwork }
                                value = { this.state.selectedFromNetwork }>
                                {this.props.networkStore.networkHolders.map((network, i) => <MenuItem key = { i } value = { i } >{ network.name }</MenuItem>)}
                            </Select>
                        </LayoutBlock>
                        <div className={'SVG Icon'} dangerouslySetInnerHTML={{ __html: SvgArrowRight }}></div>
                        <LayoutBlock className = { 'NetworkSelect' }>
                            <h3>To</h3>
                            <Select
                                disabled = {this.state.selectedFromNetwork === S.Strings.EMPTY}
                                onChange = { this.onSelectToNetwork }
                                value = { this.state.selectedToNetwork }>
                                {this.props.networkStore.networkHolders.map((network, i) => (i != this.state.selectedFromNetwork ? <MenuItem key = { i } value = { i } >{ network.name }</MenuItem> : null))}
                            </Select>
                        </LayoutBlock>
                    </LayoutBlock>
                    <LayoutBlock className = { 'FlexRow FormRow' }>
                        <Input
                            label = { `Amount: ( max = ${this.state.maxAmount} )` }
                            value = {this.state.displayAmount}
                            disabled = {this.state.selectedToNetwork === S.Strings.EMPTY}
                            onChange = { this.onChangeAmount }
                            InputProps = {{
                                endAdornment: <div className = {' FlexRow Adornment'}>
                                    <div className={this.state.selectedToNetwork === S.Strings.EMPTY ? 'Mui-disabled' : ''}>CUDOS</div>
                                    <Button disabled = {this.state.selectedToNetwork === S.Strings.EMPTY}
                                        className = {' InInput '}
                                        type = { Button.TYPE_ROUNDED }
                                        color = { Button.COLOR_SCHEME_1 }
                                        onClick = { this.onClickMaxAmount }>MAX</Button>
                                </div> }}
                            error = { this.state.amountError === S.INT_TRUE}/>
                    </LayoutBlock>
                    <LayoutBlock className = { 'FormRow' }>
                        <Input
                            label = { 'Destination address' }
                            disabled = {this.state.selectedToNetwork === S.Strings.EMPTY}
                            value = {this.state.destinationAddress}
                            onChange = { this.onChangeDestinationAddress }
                            error = { this.state.destiantionAddressError === S.INT_TRUE}/>
                    </LayoutBlock>
                    <LayoutBlock className = { 'FormRow' } >
                        <Button
                            type = { Button.TYPE_ROUNDED }
                            disabled = {this.state.selectedToNetwork === S.Strings.EMPTY}
                            color = { Button.COLOR_SCHEME_1 }
                            onClick = { this.onClickSend }>Send</Button>
                        <Button
                            type = { Button.TYPE_ROUNDED }
                            disabled = {this.state.selectedToNetwork === S.Strings.EMPTY || this.props.networkStore.networkHolders[this.state.selectedFromNetwork].name !== KeplrLedger.NETWORK_NAME}
                            color = { Button.COLOR_SCHEME_1 }
                            onClick = { this.onClickRequestBatch }>Request Batch</Button>
                    </LayoutBlock>
                </LayoutBlock>
            </LayoutBlock>
        )
    }

}

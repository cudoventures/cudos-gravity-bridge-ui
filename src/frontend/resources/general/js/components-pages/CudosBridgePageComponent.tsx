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

import S from '../../../common/js/utilities/Main';
import NetworkStore from '../../../common/js/stores/NetworkStore';

interface Props extends ContextPageComponentProps {
    networkStore: NetworkStore;
}

interface State {
    selectedFromNetwork: number,
    selectedToNetwork: number,
    amount: string,
    maxAmount: number,
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
            selectedFromNetwork: S.NOT_EXISTS,
            selectedToNetwork: S.NOT_EXISTS,
            amount: 0,
            maxAmount: Number.MAX_VALUE,
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
        })
    }

    onChangeAmount = (amount) => {
        this.setState({
            amount,
            amountError: S.INT_FALSE,
        })

        clearTimeout(this.inputTimeouts.amount);
        this.inputTimeouts.destiantionAddress = setTimeout(() => {
            if (!Number(amount) || amount > this.state.maxAmount) {
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
        const networkId = this.state.selectedFromNetwork;
        const ledger = this.props.networkStore.networkHolders[networkId].ledger;

        if (!ledger.connected) {
            await this.connectWallet(networkId);
        }

        try {
            ledger.send(this.state.amount, this.state.destinationAddress);
        } catch (e) {
            console.log(e);
        }
    }

    onClickConnectWallet = async () => {
        const networkId = this.state.selectedFromNetwork;

        this.connectWallet(networkId);
    }

    connectWallet = async (networkId: number) => {
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
            <div style = { { 'width': '1000px', 'height': '500px', 'margin': 'auto' } } className = { 'FlexSingleCenter' } >
                <LayoutBlock className = { 'SendForm' } >
                    <h2>Send CUDOS</h2>
                    <LayoutBlock direction = { LayoutBlock.DIRECTION_ROW } className = { 'NetworkSelectMenu' }>
                        <LayoutBlock className = { 'NetworkSelect' }>
                            <h3>From</h3>
                            <Select
                                label = { 'From network' }
                                onChange = { this.onSelectFromNetwork }
                                value = { this.state.selectedFromNetwork }>
                                {this.props.networkStore.networkHolders.map((network, i) => <MenuItem key = { i } value = { i } >{ network.name }</MenuItem>)}
                            </Select>
                        </LayoutBlock>
                        <LayoutBlock className = { 'NetworkSelect' }>
                            <h3>To</h3>
                            <Select
                                label = { 'To network' }
                                disabled = {this.state.selectedFromNetwork === S.NOT_EXISTS}
                                onChange = { this.onSelectToNetwork }
                                value = { this.state.selectedToNetwork }>
                                {this.props.networkStore.networkHolders.map((network, i) => (i != this.state.selectedFromNetwork ? <MenuItem key = { i } value = { i } >{ network.name }</MenuItem> : null))}
                            </Select>
                        </LayoutBlock>
                    </LayoutBlock>

                    <LayoutBlock className = { 'Inputs' }>
                        <div className = { 'FlexRow' }>
                            <Input
                                label = { `Amount: ( max = ${this.state.maxAmount} )` }
                                value = {this.state.amount}
                                disabled = {this.state.selectedToNetwork === S.NOT_EXISTS}
                                onChange = { this.onChangeAmount }
                                InputProps = {{ endAdornment: <div>CUDOS</div> }}
                                error = { this.state.amountError === S.INT_TRUE}/>
                            <Button type = { Button.TYPE_ROUNDED } color = { Button.COLOR_SCHEME_1 } onClick = { this.onClickMaxAmount }>MAX</Button>
                        </div>
                        <Input
                            label = { 'Destination address' }
                            disabled = {this.state.selectedToNetwork === S.NOT_EXISTS}
                            value = {this.state.destinationAddress}
                            onChange = { this.onChangeDestinationAddress }
                            error = { this.state.destiantionAddressError === S.INT_TRUE}/>
                    </LayoutBlock>
                    { this.renderSendButton() }
                </LayoutBlock>
            </div>
        )
    }

    renderSendButton = () => {
        if (this.state.selectedFromNetwork !== S.NOT_EXISTS) {
            if (this.props.networkStore.networkHolders[this.state.selectedFromNetwork].ledger.connected === S.INT_TRUE) {
                return <Button type = { Button.TYPE_ROUNDED } color = { Button.COLOR_SCHEME_1 } onClick = { this.onClickSend }>Send</Button>
            }

            return <Button type = { Button.TYPE_ROUNDED } color = { Button.COLOR_SCHEME_1 } onClick = { this.onClickConnectWallet }>Connect Wallet</Button>

        }

        return '';
    }

}

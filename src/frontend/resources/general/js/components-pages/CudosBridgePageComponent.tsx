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
    amount: number,
    maxAmount: number,
    amountError: number,
    destinationAddress: string,
    destiantionAddressError: number,
}


export default class CudosBridgeComponent extends ContextPageComponent < Props, State > {

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
    }

    getPageLayoutComponentCssClassName() {
        return 'CudosBridge';
    }

    onSelectFromNetwork = (value) => {
        this.setState({
            selectedFromNetwork: value
        })
    }

    onSelectToNetwork = (value) => {
        this.setState({
            selectedToNetwork: value
        })
    }

    onClickMaxAmount = () => {
        //TODO: get max amount on account
        const maxAmount = 100;
        this.setState({
            amount: maxAmount
        })
    }

    onChangeAmount = (value) => {
        let amount = parseInt(value);

        if(!amount){
            amount = 0;
        }

        if(amount > this.state.maxAmount){
            this.setState({
                amountError: S.INT_TRUE,
            })
        }

        this.setState({
            amount: amount
        })
    }

    onChangeDestinationAddress = (value) => {

        if(!this.isAddressValid(value)){
            this.setState({
                destiantionAddressError: S.INT_TRUE
            })

            return;
        }

        this.setState({
            destinationAddress: value
        })
    }

    onClickSend = async () => {
        const networkId = this.state.selectedFromNetwork;
        const ledger = this.props.networkStore.networkHolders[networkId].ledger;

        if(!ledger.connected){
            await this.connectWallet(networkId);
        }

        try{
            ledger.send(this.state.amount, this.state.destinationAddress);
        }catch(e){
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

        if(ledger.connected){
            return;
        }

        try{
            const newLedger = networkHolders[networkId].ledger;

            newLedger.connect(window);
            
        }catch(e){
            console.log(e);
        }
    }

    renderContent() {
        return (
            <div style = { { 'width': '1000px', 'height': '500px', 'margin': 'auto' } } className = { 'FlexSingleCenter' } >
                <LayoutBlock className = { "SendForm" } >
                    <h2>Send CUDOS</h2>
                    <LayoutBlock direction = { LayoutBlock.DIRECTION_ROW } className = { "NetworkSelectMenu" }>
                        <LayoutBlock className = { "NetworkSelect" }>
                            <h3>From</h3>
                            <Select
                                label = { 'From network' } 
                                onChange = { this.onSelectFromNetwork }
                                value = { this.state.selectedFromNetwork }>
                                {this.props.networkStore.networkHolders.map((network, i) => <MenuItem key = { i } value = { i } >{ network.name }</MenuItem>)}
                            </Select>
                        </LayoutBlock>
                        <LayoutBlock className = { "NetworkSelect" }>
                            <h3>To</h3>
                            <Select
                                label = { 'To network' } 
                                onChange = { this.onSelectToNetwork }
                                value = { this.state.selectedToNetwork }>
                                    {this.props.networkStore.networkHolders.map((network, i) => i != this.state.selectedFromNetwork ? <MenuItem key = { i } value = { i } >{ network.name }</MenuItem> : null)}
                            </Select>
                        </LayoutBlock>
                    </LayoutBlock>

                    <LayoutBlock className = { "Inputs" }>
                        <div className = { "FlexRow" }>
                            <Input label = { `Amount: ( max = ${this.state.maxAmount} )` } value = {this.state.amount} onChange = { this.onChangeAmount } InputProps = {{endAdornment: <div>CUDOS</div>}} error = { this.state.amountError === S.INT_TRUE}/>
                            <Button type = { Button.TYPE_ROUNDED } color = { Button.COLOR_SCHEME_1 } onClick = { this.onClickMaxAmount }>MAX</Button>
                        </div>
                        <Input label = { 'Destination address' } value = {this.state.destinationAddress} onChange = { this.onChangeDestinationAddress }/>
                    </LayoutBlock>
                    { this.state.selectedFromNetwork !== S.NOT_EXISTS ? 
                        this.props.networkStore.networkHolders[this.state.selectedFromNetwork].ledger.connected === S.INT_TRUE?
                            <Button type = { Button.TYPE_ROUNDED } color = { Button.COLOR_SCHEME_1 } onClick = { this.onClickSend }>Send</Button>
                            : <Button type = { Button.TYPE_ROUNDED } color = { Button.COLOR_SCHEME_1 } onClick = { this.onClickConnectWallet }>Connect Wallet</Button>
                         : ''}
                </LayoutBlock>
            </div>
        )
    }

    isAddressValid = (address) => {
        //TODO: check address valid based on destiantion network

        return true;
    }
}

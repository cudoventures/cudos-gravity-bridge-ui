import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import ProjectUtils from '../../../common/js/ProjectUtils';
import Button from '../../../common/js/components-inc/Button';

const KEPLR_WALLET = 1;
const METAMASK_WALLET = 0;

interface ISummaryFormProps {
    selectedFromNetwork: number
    isFromConnected: boolean
    onChnageTransactionDirection: any
    onClickSend: void
    selectedToNetwork: number
    isToConnected: boolean
    getAddress: any
    onDisconnectFromNetwork: any
    onDisconnectToNetwork: any
    onSelectFromNetwork: any
    onSelectToNetwork: any
    goToTransactionSummary: any
    connectWallet: any
    onChangeAccount: any
}

const TransferForm = (props: ISummaryFormProps) => {

    const cudosLogo = '../../../../resources/common/img/favicon/cudos-22x22.svg'
    const ethLogo = '../../../../resources/common/img/favicon/eth-16x25.svg'
    const transferLogo = '../../../../resources/common/img/favicon/transfer-logo.svg'
    const fromNetwork = props.selectedFromNetwork ? 'CUDOS' : 'Ethereum'
    const ToNetwork = props.selectedToNetwork ? 'CUDOS' : 'Ethereum'

    const [animate, setAnimate] = useState<boolean>(false);

    const changeTransaction = () => {
        props.onChnageTransactionDirection();
        setAnimate(!animate);
    }

    useEffect(():void => {
        window.addEventListener('keplr_keystorechange', async () => {
            await props.connectWallet(KEPLR_WALLET);
            await props.onChangeAccount(KEPLR_WALLET)
            console.log('reconnect Keplr    ...');
        });
    }, []);

    useEffect(():void => {
        localStorage.setItem('manualAccountChange', 'false')
        window.ethereum.on('accountsChanged', async () => {
            localStorage.setItem('manualAccountChange', 'true')
            await props.connectWallet(METAMASK_WALLET);
            await props.onChangeAccount(METAMASK_WALLET)
            console.log('reconnect Metamask...');
        });
    }, []);

    return (
        <div className={'SendForm'} >
            <div className={'Title'}>Transfer from</div>
            <div className={'Address'}>
                <div className={props.selectedFromNetwork ? 'CudosLogo' : 'EthLogo'} style={props.selectedFromNetwork ? ProjectUtils.makeBgImgStyle(cudosLogo) : ProjectUtils.makeBgImgStyle(ethLogo)} />
                {props.isFromConnected ? props.getAddress(props.selectedFromNetwork, 18) : fromNetwork}
                <Button
                    className={props.isFromConnected ? 'DisconnectBtn' : 'ConnectBtn'}
                    onClick={() => (props.isFromConnected ? props.onDisconnectFromNetwork() : props.onSelectFromNetwork(props.selectedFromNetwork))}
                    // value = { this.state.selectedFromNetwork }
                    type={Button.TYPE_ROUNDED}
                    color={props.isFromConnected ? Button.COLOR_SCHEME_2 : Button.COLOR_SCHEME_1}>{props.isFromConnected ? 'Disconnect' : 'Connect'}</Button>
            </div>
            <div className={'Wrapper'}>
                <div className={animate ? 'TransferLogo Rotate Up Pulsing' : 'TransferLogo Rotate Down Pulsing'} style={ProjectUtils.makeBgImgStyle(transferLogo)} onClick={() => changeTransaction()}></div>
            </div>
            <div className={'Title'}>Transfer to</div>
            <div className={'Address'}>
                <div className={props.selectedToNetwork ? 'CudosLogo' : 'EthLogo'} style={props.selectedToNetwork ? ProjectUtils.makeBgImgStyle(cudosLogo) : ProjectUtils.makeBgImgStyle(ethLogo)} />
                {props.isToConnected ? (props.getAddress(props.selectedToNetwork, 18)) : ToNetwork}
                <Button
                    className={props.isToConnected ? 'DisconnectBtn' : 'ConnectBtn'}
                    onClick={() => (props.isToConnected ? props.onDisconnectToNetwork() : props.onSelectToNetwork(props.selectedToNetwork))}
                    value={props.selectedToNetwork}
                    type={Button.TYPE_ROUNDED}
                    color={props.isToConnected ? Button.COLOR_SCHEME_2 : Button.COLOR_SCHEME_1}>{props.isToConnected ? 'Disconnect' : 'Connect'}</Button>
            </div>
            <div className={'FormRow Wrapper'} >
                <Button
                    disabled={(!props.isFromConnected || !props.isToConnected)}
                    className={'TransferBtn'}
                    type={Button.TYPE_ROUNDED}
                    color={Button.COLOR_SCHEME_1}
                    onClick={() => props.goToTransactionSummary()}
                >Begin new transfer
                </Button>
            </div>
        </div>
    )
}

export default TransferForm

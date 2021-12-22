import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import ProjectUtils from '../../../common/js/ProjectUtils';
import Button from '../../../common/js/components-inc/Button';

const KEPLR_WALLET = 1;
const METAMASK_WALLET = 0;

const TransferForm = ({
    selectedFromNetwork,
    isFromConnected,
    onChnageTransactionDirection,
    selectedToNetwork,
    isToConnected,
    getAddress,
    onDisconnectFromNetwork,
    onDisconnectToNetwork,
    onSelectFromNetwork,
    onSelectToNetwork,
    goToTransactionSummary,
    connectWallet,
    onChangeAccount,
}
:
{
    selectedFromNetwork: number
    isFromConnected: boolean
    onChnageTransactionDirection: any
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
}) => {

    const cudosLogo = '../../../../resources/common/img/favicon/cudos-22x22.svg'
    const ethLogo = '../../../../resources/common/img/favicon/eth-16x25.svg'
    const transferLogo = '../../../../resources/common/img/favicon/transfer-logo.svg'
    const fromNetwork = selectedFromNetwork ? 'CUDOS' : 'Ethereum'
    const ToNetwork = selectedToNetwork ? 'CUDOS' : 'Ethereum'

    const [animate, setAnimate] = useState<boolean>(false);

    const changeTransaction = () => {
        onChnageTransactionDirection();
        setAnimate(!animate);
    }

    useEffect(():void => {
        window.addEventListener('keplr_keystorechange', async () => {
            await connectWallet(KEPLR_WALLET);
            await onChangeAccount(KEPLR_WALLET)
            console.log('reconnect Keplr    ...');
        });
    }, []);

    useEffect(():void => {
        localStorage.setItem('manualAccountChange', 'false')
        window.ethereum.on('accountsChanged', async () => {
            localStorage.setItem('manualAccountChange', 'true')
            await connectWallet(METAMASK_WALLET);
            await onChangeAccount(METAMASK_WALLET)
            console.log('reconnect Metamask...');
        });
    }, []);

    return (
        <div className={'SendForm'} >
            <div className={'Title'}>Transfer from</div>
            <div className={'Address'}>
                <div className={selectedFromNetwork ? 'CudosLogo' : 'EthLogo'} style={selectedFromNetwork ? ProjectUtils.makeBgImgStyle(cudosLogo) : ProjectUtils.makeBgImgStyle(ethLogo)} />
                {isFromConnected ? getAddress(selectedFromNetwork, 18) : fromNetwork}
                <Button
                    className={isFromConnected ? 'DisconnectBtn' : 'ConnectBtn'}
                    onClick={() => (isFromConnected ? onDisconnectFromNetwork() : onSelectFromNetwork(selectedFromNetwork))}
                    type={Button.TYPE_ROUNDED}
                    color={isFromConnected ? Button.COLOR_SCHEME_2 : Button.COLOR_SCHEME_1}>{isFromConnected ? 'Disconnect' : 'Connect'}</Button>
            </div>
            <div className={'Wrapper'}>
                <div className={animate ? 'TransferLogo Rotate Up Pulsing' : 'TransferLogo Rotate Down Pulsing'} style={ProjectUtils.makeBgImgStyle(transferLogo)} onClick={() => changeTransaction()}></div>
            </div>
            <div className={'Title'}>Transfer to</div>
            <div className={'Address'}>
                <div className={selectedToNetwork ? 'CudosLogo' : 'EthLogo'} style={selectedToNetwork ? ProjectUtils.makeBgImgStyle(cudosLogo) : ProjectUtils.makeBgImgStyle(ethLogo)} />
                {isToConnected ? (getAddress(selectedToNetwork, 18)) : ToNetwork}
                <Button
                    className={isToConnected ? 'DisconnectBtn' : 'ConnectBtn'}
                    onClick={() => (isToConnected ? onDisconnectToNetwork() : onSelectToNetwork(selectedToNetwork))}
                    value={selectedToNetwork}
                    type={Button.TYPE_ROUNDED}
                    color={isToConnected ? Button.COLOR_SCHEME_2 : Button.COLOR_SCHEME_1}>{isToConnected ? 'Disconnect' : 'Connect'}</Button>
            </div>
            <div className={'FormRow Wrapper'} >
                <Button
                    disabled={(!isFromConnected || !isToConnected)}
                    className={'TransferBtn'}
                    type={Button.TYPE_ROUNDED}
                    color={Button.COLOR_SCHEME_1}
                    onClick={() => goToTransactionSummary()}
                >Begin new transfer
                </Button>
            </div>
        </div>
    )
}

export default TransferForm

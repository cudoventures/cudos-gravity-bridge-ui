/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import ProjectUtils from '../../../common/js/ProjectUtils';
import Button from '../../../common/js/components-inc/Button';

const TransferForm = ({
    selectedFromNetwork,
    isFromConnected,
    onDisconnectFromNetwork,
    onDisconnectToNetwork,
    onSelectFromNetwork,
    onSelectToNetwork,
    onChnageTransactionDirection,
    selectedToNetwork,
    isToConnected,
    getAddress,
    goToTransactionSummary,
}) => {

    const cudosLogo = '../../../../resources/common/img/favicon/cudos-22x22.svg'
    const ethLogo = '../../../../resources/common/img/favicon/eth-16x25.svg'
    const transferLogo = '../../../../resources/common/img/favicon/transfer-logo.svg'
    const fromNetwork = selectedFromNetwork ? 'CUDOS' : 'Ethereum'
    const ToNetwork = selectedToNetwork ? 'CUDOS' : 'Ethereum'

    return (
        <div className={'SendForm'} >
            <div className={'Title'}>Transfer from</div>
            <div className={'Address'}>
                <div className={selectedFromNetwork ? 'CudosLogo' : 'EthLogo'} style={selectedFromNetwork ? ProjectUtils.makeBgImgStyle(cudosLogo) : ProjectUtils.makeBgImgStyle(ethLogo)} />
                {isFromConnected ? getAddress(selectedFromNetwork, 18) : fromNetwork}
                <Button
                    className={isFromConnected ? 'DisconnectBtn' : 'ConnectBtn'}
                    onClick={() => (isFromConnected ? onDisconnectFromNetwork() : onSelectFromNetwork(selectedFromNetwork))}
                    // value = { this.state.selectedFromNetwork }
                    type={Button.TYPE_ROUNDED}
                    color={isFromConnected ? Button.COLOR_SCHEME_2 : Button.COLOR_SCHEME_1}>{isFromConnected ? 'Disconnect' : 'Connect'}</Button>
            </div>
            <div className={'Wrapper'}>
                <div className={'TransferLogo'} style={ProjectUtils.makeBgImgStyle(transferLogo)} onClick={() => onChnageTransactionDirection()}></div>
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

TransferForm.propTypes = {
    selectedFromNetwork: PropTypes.number,
}

export default TransferForm

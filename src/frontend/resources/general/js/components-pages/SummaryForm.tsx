/* eslint-disable react/prop-types */
import React from 'react';
import ProjectUtils from '../../../common/js/ProjectUtils';

const SummaryForm = ({
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
}) => {

    const transferLogo = '../../../../resources/common/img/favicon/transfer-logo.svg';
    const cudosLogo = '../../../../resources/common/img/favicon/cudos-22x22.svg'
    const ethLogo = '../../../../resources/common/img/favicon/eth-16x25.svg'

    return (
        <div className={'SummaryForm'}>
            <div className={'Row'}>
                <div className={'Column'}>
                    <div>
                        <span>From</span>
                        <span>To</span>
                    </div>
                    <div className={'Wrapper'}>
                        <div className={'SummaryAddress'}>
                            <span className={selectedFromNetwork ? 'CudosLogo' : 'EthLogo'} style={selectedFromNetwork ? ProjectUtils.makeBgImgStyle(cudosLogo) : ProjectUtils.makeBgImgStyle(ethLogo)}>0xabe2...cbac</span>
                        </div>
                        <span className={'TransferLogo RotateLogo'} style={ProjectUtils.makeBgImgStyle(transferLogo)}></span>
                        <span className={'SummaryAddress'}>0xabe2...cbac</span>
                    </div>
                    <div>
                        <div>Destination address</div>
                    </div>
                    <div className={'Wrapper'}>
                        <span className={'SummaryAddress'}>0xabe2649c0a52168b185ef42b9f61abfc87f2cbac</span>
                    </div>
                    <div>
                        <div>Asset</div>
                    </div>
                    <div className={'Wrapper'}>
                        <span className={'SummaryAddress'}>CUDOS</span>
                    </div>
                    <div>
                        <div>Amount</div>
                    </div>
                    <div className={'Wrapper'}>
                        <span className={'SummaryAddress'}>0.123459</span>
                    </div>
                </div>
                <div className={'Column PaddingRightColumn'}>
                    <div>Transaction Summary</div>
                    <div>
                        <span>From</span>
                        <span>To</span>
                    </div>
                    <div>
                        <span>CUDOS</span>
                        <span>Ethereum</span>
                    </div>
                    <div>
                        <span>Destination Address</span>
                    </div>
                    <div>
                        <span>0xabe2649c0a52168b185ef42b9f61abfc87f2cbac</span>
                    </div>
                    <div>
                        <span>Amount</span>
                        <span>Asset</span>
                    </div>
                    <div>
                        <span>0.123459</span>
                        <span>CUDOS</span>
                    </div>
                    <div>
                        <span>Estimated Gas Fee</span>
                        <span>0.00012 CUDOS</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SummaryForm

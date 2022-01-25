import React from 'react';
import ModalComponent from './ModalComponent';

import '../../css/components-popups/summary-modal.css';

import Button from '../components-inc/Button';
import ProjectUtils from '../ProjectUtils';

const SummaryModal = ({
    closeModal,
    isOpen,
    getAddress,
    selectedFromNetwork,
    selectedToNetwork,
    displayAmount,
    onGetBalance,
    txHash,
}
    : { closeModal: Function,
        isOpen: boolean,
        getAddress: Function,
        selectedFromNetwork: number,
        selectedToNetwork: number,
        displayAmount: string,
        onGetBalance: Function,
        txHash: string,
    }) => {

    const cudosLogoSmall = '../../../../resources/common/img/favicon/cudos-18x18.svg';
    const ethLogoSmall = '../../../../resources/common/img/favicon/eth-18x18.svg';
    const successIcon = '../../../../resources/common/img/favicon/successs-icon.svg';
    const closeIcon = '../../../../resources/common/img/favicon/close-icon-24x24.svg';
    const attentionIcon = '../../../../resources/common/img/favicon/attention-20x20.svg';
    const linkIcon = '../../../../resources/common/img/favicon/link-icon.svg';

    const fromNetwork = selectedFromNetwork ? 'CUDOS' : 'Ethereum';
    const ToNetwork = selectedToNetwork ? 'CUDOS' : 'Ethereum';

    const ETHERSCAN_RINKEBY = 'https://rinkeby.etherscan.io/tx';
    const ETHERSCAN_MAINNET = 'https://etherscan.io/tx';
    const CUDOS_EXPLOREER = 'https://explorer.cudos.org/transactions';

    const onCloseModal = async () => {
        onGetBalance();
        closeModal();
    }

    return (
        <ModalComponent closeModal={closeModal} isOpen={isOpen}>
            <div className={'SummaryForm'}>
                <div>
                    <div className={'CloseIcon'} onClick={() => onCloseModal()} style={ProjectUtils.makeBgImgStyle(closeIcon)}></div>
                </div>
                <div className={'Wrapper'}>
                    <div className={'SuceessIcon'} style={ProjectUtils.makeBgImgStyle(successIcon)}></div>
                </div>
                <div className={'Title'}>Success!</div>
                <div className={'Row Margin'}>
                    <div className={'Column'}>
                        <div>
                            <div className={'Row Spacing'}>
                                <span className={'FlexStart FlexRight'}>From</span>
                                <span className={'FlexStart'}>To</span>
                            </div>
                            <div className={'Row Spacing'}>
                                <span className={'FlexStart FlexRight'}>
                                    <div className={selectedFromNetwork ? 'CudosLogoSmall NoMarginLeft' : 'EthLogoSmall NoMarginLeft'} style={selectedFromNetwork ? ProjectUtils.makeBgImgStyle(cudosLogoSmall) : ProjectUtils.makeBgImgStyle(ethLogoSmall)}></div>
                                    <div className={'AlignCenter Weight500'}>{fromNetwork}</div>
                                </span>
                                <span className={'FlexStart'}>
                                    <div className={selectedToNetwork ? 'CudosLogoSmall NoMarginLeft' : 'EthLogoSmall NoMarginLeft'} style={selectedToNetwork ? ProjectUtils.makeBgImgStyle(cudosLogoSmall) : ProjectUtils.makeBgImgStyle(ethLogoSmall)}></div>
                                    <div className={'AlignCenter Weight500'}>{ToNetwork}</div>
                                </span>
                            </div>
                            <div className={'Row Spacing'}>
                                <span className={'FlexStart GrayText FlexRight'}>{getAddress(selectedFromNetwork, 10)}</span>
                                <span className={'FlexStart GrayText'}>{getAddress(selectedToNetwork, 10)}</span>
                            </div>
                            <div className={'DoubleSpacing'}>
                                <span>Destination Address</span>
                            </div>
                            <div>
                                <span className={'GrayText Weight500'}>{getAddress(selectedToNetwork, 0)}</span>
                            </div>
                            <div className={'Row DoubleSpacing'}>
                                <span className={'FlexStart Amount'}>Amount</span>
                                <span className={'FlexStart Asset FlexRight'}>Asset</span>
                            </div>
                            <div className={'Row Spacing'}>
                                <span className={'FlexStart GrayText Weight600 Cudos'}>{!displayAmount ? '0.0' : displayAmount}</span>
                                <span className={'FlexStart GrayText Asset Weight600 FlexRight'}>CUDOS</span>
                            </div>
                            {/* Gas Fee temporarily disabled */}
                            {/* <div className={'Row DoubleSpacing TopBorder'}>
                                <span className={'FlexStart'}>
                            Gas Fee
                                </span>
                                <span className={'FlexEnd Weight600'}>0.00012 CUDOS</span>
                            </div> */}
                            <div style={{ marginTop: '85px' }} className={'Row DoubleSpacing TopBorder'}>
                                <div>Transaction</div>
                            </div>
                            <div className={'Row Spacing LinkWrapper'}>
                                <div className={'LinkContent'}><a href= {`${selectedFromNetwork ? CUDOS_EXPLOREER : ETHERSCAN_RINKEBY}/${txHash}`} rel='noreferrer' target='_blank'>
                                    Bridge transaction link</a>
                                <div className={'LinkIcon'} style={ProjectUtils.makeBgImgStyle(linkIcon)} />
                                </div>
                            </div>
                            <div className={'Row DoubleSpacing'}>
                                <div className={'TransactionMesasge'}>
                                    <div className={'AttentionIcon'} style={ProjectUtils.makeBgImgStyle(attentionIcon)}/>
                                    Your transaction was sent successfully and will be executed in the next max 5-6 minutes.
                                </div>
                            </div>
                            <div className={'Flex DoubleSpacing BtnWrapper'}>
                                <Button
                                    className={'TransferBtn'}
                                    type={Button.TYPE_ROUNDED}
                                    color={Button.COLOR_SCHEME_1}
                                    onClick={() => onCloseModal()}
                                >Transfer again
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ModalComponent>
    )
}

export default SummaryModal

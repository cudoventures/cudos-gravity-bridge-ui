/* eslint-disable react/prop-types */
import React from 'react';
import ProjectUtils from '../../../common/js/ProjectUtils';
import Button from '../../../common/js/components-inc/Button';

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
    const cudosLogoSmall = '../../../../resources/common/img/favicon/cudos-18x18.svg'
    const ethLogo = '../../../../resources/common/img/favicon/eth-16x25.svg'

    return (
        <div className={'SummaryForm'}>
            <div className={'Row'}>
                <div className={'Column'}>
                    <div className={'Wrapper'}>
                        <div className={'Flex'}>
                            <div className={'SpacingBottom'}>From</div>
                            <div className={'SummaryAddress'}>
                                <div className={selectedFromNetwork ? 'CudosLogo' : 'EthLogo'} style={selectedFromNetwork ? ProjectUtils.makeBgImgStyle(cudosLogo) : ProjectUtils.makeBgImgStyle(ethLogo)}></div>
                                <div>0xabe2...cbac</div>
                            </div>
                        </div>
                        <div className={'TransferLogoWrapper'}>
                            <div className={'TransferLogo RotateLogo'} style={ProjectUtils.makeBgImgStyle(transferLogo)}></div>
                        </div>
                        <div className={'Flex'}>
                            <div className={'SpacingBottom'}>To</div>
                            <div className={'SummaryAddress'}>
                                <div className={selectedToNetwork ? 'CudosLogo' : 'EthLogo'} style={selectedToNetwork ? ProjectUtils.makeBgImgStyle(cudosLogo) : ProjectUtils.makeBgImgStyle(ethLogo)}></div>
                                <div >0xabe2...cbac</div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className={'Spacing'}>Destination address</div>
                    </div>
                    <div className={'Wrapper Flex'}>
                        <span className={'SummaryAddress CenterContent'}>0xabe2649c0a52168b185ef42b9f61abfc87f2cbac</span>
                    </div>
                    <div>
                        <div className={'Spacing'}>Asset</div>
                    </div>
                    <div className={'Flex'}>
                        <div className={'Wrapper'}>
                            <div className={'SummaryAddress'}>
                                <div className={'CudosLogoSmall'} style={ProjectUtils.makeBgImgStyle(cudosLogoSmall)}></div>
                                <div className={'Cudos'}>
                            CUDOS
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className={'Spacing'}>
                            Amount
                        </div>
                    </div>
                    <div className={'Flex'}>
                        <div className={'SummaryAddress'}>
                            <div className={'Amount'}>
                            0.123459
                                <Button
                                    color={Button.COLOR_SCHEME_4}
                                    className={'MaxBtn'}>
                                    MAX
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div className={'Row Spacing'}>
                        <span className={'FlexStart GrayText'}>Contract Balance:</span>
                        <span className={'FlexEnd'}>5.1234547639 CUDOS</span>
                    </div>
                    <div className={'Row Spacing'}>
                        <span className={'FlexStart GrayText'}>Wallet Balance:</span>
                        <span className={'FlexEnd'}>0.123459 CUDOS</span>
                    </div>
                </div>
                <div className={'Column PaddingRightColumn'}>
                    <div>
                        <div className={'SummaryTitle'}>Transaction Summary</div>
                        <div className={'Row Spacing'}>
                            <span className={'FlexStart'}>From</span>
                            <span className={'FlexStart'}>To</span>
                        </div>
                        <div className={'Row Spacing'}>
                            <span className={'FlexStart'}>
                                <div className={selectedFromNetwork ? 'CudosLogo NoMarginLeft' : 'EthLogo NoMarginLeft'} style={selectedFromNetwork ? ProjectUtils.makeBgImgStyle(cudosLogo) : ProjectUtils.makeBgImgStyle(ethLogo)}></div>
                                <div className={'AlignCenter'}>CUDOS</div>
                            </span>
                            <span className={'FlexStart'}>
                                <div className={selectedToNetwork ? 'CudosLogo NoMarginLeft' : 'EthLogo NoMarginLeft'} style={selectedToNetwork ? ProjectUtils.makeBgImgStyle(cudosLogo) : ProjectUtils.makeBgImgStyle(ethLogo)}></div>
                                <div className={'AlignCenter'}>Ethereum</div>
                            </span>
                        </div>
                        <div className={'Row Spacing'}>
                            <span className={'FlexStart GrayText'}>0xabe23434...cbac</span>
                            <span className={'FlexStart GrayText'}>0xabe23434...cbac</span>
                        </div>
                    </div>
                    <div className={'Spacing'}>
                        <span>Destination Address</span>
                    </div>
                    <div>
                        <span className={'GrayText'}>0xabe2649c0a52168b185ef42b9f61abfc87f2cbac</span>
                    </div>
                    <div className={'Row Spacing'}>
                        <span className={'FlexStart'}>Amount</span>
                        <span className={'FlexStart'}>Asset</span>
                    </div>
                    <div className={'Row Spacing'}>
                        <span className={'FlexStart GrayText'}>0.123459</span>
                        <span className={'FlexStart GrayText'}>CUDOS</span>
                    </div>
                    <div className={'Row Spacing'}>
                        <span className={'FlexStart'}>Estimated Gas Fee</span>
                        <span className={'FlexStart'}>0.00012 CUDOS</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SummaryForm

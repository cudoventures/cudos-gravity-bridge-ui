/* eslint-disable react/prop-types */
import React from 'react';
import ProjectUtils from '../../../common/js/ProjectUtils';
import Button from '../../../common/js/components-inc/Button';

const SummaryForm = ({
    selectedFromNetwork,
    isFromConnected,
    contractBalance,
    walletBalance,
    displayAmount,
    onDisconnectFromNetwork,
    onDisconnectToNetwork,
    onSelectFromNetwork,
    onSelectToNetwork,
    onChangeAmount,
    onClickMaxAmount,
    onChnageTransactionDirection,
    selectedToNetwork,
    isToConnected,
    getAddress,
}) => {

    const transferLogo = '../../../../resources/common/img/favicon/transfer-logo.svg';
    const cudosLogo = '../../../../resources/common/img/favicon/cudos-22x22.svg';
    const cudosLogoSmall = '../../../../resources/common/img/favicon/cudos-18x18.svg';
    const ethLogoSmall = '../../../../resources/common/img/favicon/eth-18x18.svg';
    const ethLogo = '../../../../resources/common/img/favicon/eth-16x25.svg';
    const attentionIcon = '../../../../resources/common/img/favicon/attention.svg';

    const fromNetwork = selectedFromNetwork ? 'CUDOS' : 'Ethereum'
    const ToNetwork = selectedToNetwork ? 'CUDOS' : 'Ethereum'

    return (
        <div className={'SummaryForm'}>
            <div className={'Row'}>
                <div className={'Column'}>
                    <div className={'Wrapper'}>
                        <div className={'Flex'}>
                            <div className={'SpacingBottom'}>From</div>
                            <div className={'SummaryAddress'}>
                                <div className={selectedFromNetwork ? 'CudosLogo' : 'EthLogo'} style={selectedFromNetwork ? ProjectUtils.makeBgImgStyle(cudosLogo) : ProjectUtils.makeBgImgStyle(ethLogo)}></div>
                                <div>{getAddress(selectedFromNetwork, 6)}</div>
                            </div>
                        </div>
                        <div className={'TransferLogoWrapper'}>
                            <div className={'TransferLogo RotateLogo'}
                                style={ProjectUtils.makeBgImgStyle(transferLogo)}
                                onClick={() => onChnageTransactionDirection()}
                            ></div>
                        </div>
                        <div className={'Flex'}>
                            <div className={'SpacingBottom'}>To</div>
                            <div className={'SummaryAddress'}>
                                <div className={selectedToNetwork ? 'CudosLogo' : 'EthLogo'} style={selectedToNetwork ? ProjectUtils.makeBgImgStyle(cudosLogo) : ProjectUtils.makeBgImgStyle(ethLogo)}></div>
                                <div >{getAddress(selectedToNetwork, 6)}</div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className={'Spacing'}>Destination address</div>
                    </div>
                    <div className={'Wrapper Flex'}>
                        <span className={'SummaryAddress CenterContent'}>{getAddress(selectedToNetwork, 0)}</span>
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
                            <div className={'Amount Flex'}>
                                <input inputMode='decimal' type='text' value={displayAmount} onChange={(e) => onChangeAmount(e.target.value)} className={'SummaryInput'} placeholder='0'></input>
                                <Button
                                    color={Button.COLOR_SCHEME_4}
                                    className={'MaxBtn'}
                                    onClick={onClickMaxAmount}
                                >
                                    MAX
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div className={'Row Spacing'}>
                        <span className={'FlexStart GrayText'}>Contract Balance:</span>
                        <span className={'FlexEnd SummaryBalance'}>{contractBalance.toFixed(2)} CUDOS</span>
                    </div>
                    <div className={'Row Spacing'}>
                        <span className={'FlexStart GrayText'}>Wallet Balance:</span>
                        <span className={'FlexEnd SummaryBalance'}>{walletBalance.toFixed()} CUDOS</span>
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
                                <div className={selectedFromNetwork ? 'CudosLogoSmall NoMarginLeft' : 'EthLogoSmall NoMarginLeft'} style={selectedFromNetwork ? ProjectUtils.makeBgImgStyle(cudosLogoSmall) : ProjectUtils.makeBgImgStyle(ethLogoSmall)}></div>
                                <div className={'AlignCenter'}>{fromNetwork}</div>
                            </span>
                            <span className={'FlexStart'}>
                                <div className={selectedToNetwork ? 'CudosLogoSmall NoMarginLeft' : 'EthLogoSmall NoMarginLeft'} style={selectedToNetwork ? ProjectUtils.makeBgImgStyle(cudosLogoSmall) : ProjectUtils.makeBgImgStyle(ethLogoSmall)}></div>
                                <div className={'AlignCenter'}>{ToNetwork}</div>
                            </span>
                        </div>
                        <div className={'Row Spacing'}>
                            <span className={'FlexStart GrayText'}>{getAddress(selectedFromNetwork, 10)}</span>
                            <span className={'FlexStart GrayText'}>{getAddress(selectedToNetwork, 10)}</span>
                        </div>
                    </div>
                    <div className={'DoubleSpacing'}>
                        <span>Destination Address</span>
                    </div>
                    <div>
                        <span className={'GrayText'}>{getAddress(selectedToNetwork, 0)}</span>
                    </div>
                    <div className={'Row DoubleSpacing'}>
                        <span className={'FlexStart'}>Amount</span>
                        <span className={'FlexStart Asset'}>Asset</span>
                    </div>
                    <div className={'Row Spacing'}>
                        <span className={'FlexStart GrayText'}>{!displayAmount ? '0.0' : displayAmount}</span>
                        <span className={'FlexStart GrayText Asset'}>CUDOS</span>
                    </div>
                    <div className={'Row DoubleSpacing TopBorder'}>
                        <span className={'FlexStart'}>
                            Estimated Gas Fee
                            <div className={'AttentionIcon'} style={ProjectUtils.makeBgImgStyle(attentionIcon)}></div>
                        </span>
                        <span className={'FlexEnd'}>0.00012 CUDOS</span>
                    </div>
                    <div>
                        <div className={'FormRow Wrapper'} >
                            <Button
                                disabled={(!isFromConnected || !isToConnected)}
                                className={'TransferBtn Flex DoubleSpacing'}
                                type={Button.TYPE_ROUNDED}
                                color={Button.COLOR_SCHEME_1}
                            >Transfer
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SummaryForm

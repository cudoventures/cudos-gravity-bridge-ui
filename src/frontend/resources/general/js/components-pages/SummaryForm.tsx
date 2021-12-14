import React, { useEffect, useState } from 'react';
import { api } from '../../../common/js/api/GasOracleAPI';

import Button from '../../../common/js/components-inc/Button';
import ProjectUtils from '../../../common/js/ProjectUtils';
import S from '../../../common/js/utilities/Main';
import BigNumber from 'bignumber.js';

interface ISummaryFormProps {
    selectedFromNetwork: number
    isFromConnected: boolean
    contractBalance: BigNumber
    walletBalance: BigNumber
    displayAmount: string
    onChangeAmount: any
    onClickMaxAmount: void
    onChnageTransactionDirection: any
    onClickSend: void
    selectedToNetwork: number
    isToConnected: boolean
    getAddress: any
}

const SummaryForm = (props: ISummaryFormProps) => {

    const transferLogo = '../../../../resources/common/img/favicon/transfer-logo-sm.svg';
    const cudosLogo = '../../../../resources/common/img/favicon/cudos-22x22.svg';
    const cudosLogoSmall = '../../../../resources/common/img/favicon/cudos-18x18.svg';
    const ethLogoSmall = '../../../../resources/common/img/favicon/eth-18x18.svg';
    const ethLogo = '../../../../resources/common/img/favicon/eth-16x25.svg';
    const attentionIcon = '../../../../resources/common/img/favicon/attention.svg';

    const fromNetwork = props.selectedFromNetwork ? 'CUDOS' : 'Ethereum';
    const ToNetwork = props.selectedToNetwork ? 'CUDOS' : 'Ethereum';

    const [animate, setAnimate] = useState<boolean>(false)

    const changeTransaction = (): void => {
        props.onChnageTransactionDirection();
        setAnimate(!animate);
    }

    useEffect(() => {
        api()
    }, [])

    return (
        <div className={'SummaryForm'}>
            <div className={'Row'}>
                <div className={'Column'}>
                    <div className={'Wrapper'}>
                        <div className={'Flex'}>
                            <div className={'SpacingBottom'}>From</div>
                            <div className={'SummaryAddress'}>
                                <div className={props.selectedFromNetwork ? 'CudosLogo' : 'EthLogo'} style={props.selectedFromNetwork ? ProjectUtils.makeBgImgStyle(cudosLogo) : ProjectUtils.makeBgImgStyle(ethLogo)}></div>
                                <div>{props.getAddress(props.selectedFromNetwork, 6)}</div>
                            </div>
                        </div>
                        <div className={'TransferLogoWrapper'}>
                            <div className={animate ? 'TransferLogoSmall Rotate Down PulsingSmall' : 'TransferLogoSmall Rotate Up PulsingSmall'}
                                style={ProjectUtils.makeBgImgStyle(transferLogo)}
                                onClick={() => changeTransaction()}
                            ></div>
                        </div>
                        <div className={'Flex'}>
                            <div className={'SpacingBottom'}>To</div>
                            <div className={'SummaryAddress'}>
                                <div className={props.selectedToNetwork ? 'CudosLogo' : 'EthLogo'} style={props.selectedToNetwork ? ProjectUtils.makeBgImgStyle(cudosLogo) : ProjectUtils.makeBgImgStyle(ethLogo)}></div>
                                <div >{props.getAddress(props.selectedToNetwork, 6)}</div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className={'Spacing'}>Destination address</div>
                    </div>
                    <div className={'Wrapper Flex'}>
                        <span className={'SummaryAddress CenterContent'}>{props.getAddress(props.selectedToNetwork, 0)}</span>
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
                                <input inputMode='decimal' type='text' value={props.displayAmount} onChange={(e) => props.onChangeAmount(e.target.value)} className={'SummaryInput'} placeholder='0'></input>
                                <Button
                                    color={Button.COLOR_SCHEME_4}
                                    className={'MaxBtn'}
                                    onClick={props.onClickMaxAmount}
                                    disabled={props.selectedToNetwork === S.NOT_EXISTS || props.walletBalance.toFixed() === '0'}
                                >
                                    MAX
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div className={'Row Spacing'}>
                        <span className={'FlexStart GrayText'}>Contract Balance:</span>
                        <span className={'FlexEnd SummaryBalance'}>{props.contractBalance.toFixed(2)} CUDOS</span>
                    </div>
                    <div className={'Row Spacing'}>
                        <span className={'FlexStart GrayText'}>Wallet Balance:</span>
                        <span className={'FlexEnd SummaryBalance'}>{props.walletBalance.toFixed()} CUDOS</span>
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
                                <div className={props.selectedFromNetwork ? 'CudosLogoSmall NoMarginLeft' : 'EthLogoSmall NoMarginLeft'} style={props.selectedFromNetwork ? ProjectUtils.makeBgImgStyle(cudosLogoSmall) : ProjectUtils.makeBgImgStyle(ethLogoSmall)}></div>
                                <div className={'AlignCenter'}>{fromNetwork}</div>
                            </span>
                            <span className={'FlexStart'}>
                                <div className={props.selectedToNetwork ? 'CudosLogoSmall NoMarginLeft' : 'EthLogoSmall NoMarginLeft'} style={props.selectedToNetwork ? ProjectUtils.makeBgImgStyle(cudosLogoSmall) : ProjectUtils.makeBgImgStyle(ethLogoSmall)}></div>
                                <div className={'AlignCenter'}>{ToNetwork}</div>
                            </span>
                        </div>
                        <div className={'Row Spacing'}>
                            <span className={'FlexStart GrayText'}>{props.getAddress(props.selectedFromNetwork, 10)}</span>
                            <span className={'FlexStart GrayText'}>{props.getAddress(props.selectedToNetwork, 10)}</span>
                        </div>
                    </div>
                    <div className={'DoubleSpacing'}>
                        <span>Destination Address</span>
                    </div>
                    <div>
                        <span className={'GrayText'}>{props.getAddress(props.selectedToNetwork, 0)}</span>
                    </div>
                    <div className={'Row DoubleSpacing'}>
                        <span className={'FlexStart'}>Amount</span>
                        <span className={'FlexStart Asset'}>Asset</span>
                    </div>
                    <div className={'Row Spacing'}>
                        <span className={'FlexStart GrayText'}>{!props.displayAmount ? '0.0' : props.displayAmount}</span>
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
                                disabled={(!props.isFromConnected || !props.isToConnected || props.displayAmount === S.Strings.EMPTY)}
                                className={'TransferBtn Flex DoubleSpacing'}
                                type={Button.TYPE_ROUNDED}
                                color={Button.COLOR_SCHEME_1}
                                onClick={props.onClickSend}
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
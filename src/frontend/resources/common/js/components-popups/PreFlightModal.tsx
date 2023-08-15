import React from 'react';
import ModalComponent from './ModalComponent';

import Button from '../components-inc/Button';
import ProjectUtils from '../ProjectUtils';
import '../../css/components-popups/pre-flight-modal.css';
import BigNumber from 'bignumber.js';

const PreFlightModal = ({
    closeModal,
    rejectModal,
    isOpen,
    transferAmount,
    fromAddress,
    toAddress,
    selectedFromNetwork,
    selectedToNetwork,
}
: {
    closeModal: Function
    rejectModal: Function
    isOpen: boolean
    transferAmount: string
    fromAddress: string
    toAddress: string
    selectedFromNetwork: number
    selectedToNetwork: number
}) => {

    const attentionLogo = '../../../../resources/common/img/favicon/attention.svg';
    const closeIcon = '../../../../resources/common/img/favicon/close-icon-24x24.svg';

    const fromNetwork = selectedFromNetwork ? ProjectUtils.CUDOS_NETWORK_TEXT : ProjectUtils.ETHEREUM_NETWORK_TEXT;
    const toNetwork = selectedToNetwork ? ProjectUtils.CUDOS_NETWORK_TEXT : ProjectUtils.ETHEREUM_NETWORK_TEXT;

    return (
        <ModalComponent closeModal={closeModal} isOpen={isOpen}>
            <div className={'PreFlightForm'}>
                <div>
                    <div className={'CloseIcon'} onClick={() => rejectModal()} style={ProjectUtils.makeBgImgStyle(closeIcon)}></div>
                </div>
                <div className={'Title'}>Pre-flight check</div>
                <div className={'Subheader'}>THIS IS AN EXPERIMENTAL APPLICATION</div>
                <div className={'warningMessage'}>
                    <ul>
                        <li>You will not be able to cancel the transaction once you submit it.</li>
                        <li>Your transaction could get stuck for an indefinite amount of time.</li>
                        <li>Funds cannot be returned if they are sent to the wrong address.</li>
                    </ul>
                </div>
                <div className={'transactionMessage'}>
                    <p>I agree and want to send {transferAmount} CUDOS</p>
                    <dl>
                        <dt>from:</dt>
                        <dd>{fromAddress} @ {fromNetwork} network</dd>
                        <dt>to:</dt>
                        <dd>{toAddress} @ {toNetwork} network</dd>
                    </dl>
                </div>
                <div className={'Flex DoubleSpacing BtnWrapper'}>
                    <Button
                        className={'ConfirmButton'}
                        type={Button.TYPE_ROUNDED}
                        color={Button.COLOR_SCHEME_1}
                        onClick={() => closeModal()}
                    >Start transfer
                    </Button>
                </div>
                <div className={'Flex DoubleSpacing BtnWrapper'}>
                    <Button
                        className={'BackButton'}
                        type={Button.TYPE_ROUNDED}
                        color={Button.COLOR_SCHEME_1}
                        onClick={() => rejectModal()}
                    >Back
                    </Button>
                </div>
            </div>
        </ModalComponent>
    )
}

export default PreFlightModal

import React from 'react';
import ModalComponent from './ModalComponent';

import ProjectUtils from '../ProjectUtils';
import '../../css/components-popups/loading-modal.css';

const LoadingModal = ({
    closeModal,
    isOpen,
}
: {
    closeModal: Function
    isOpen: boolean
}) => {

    const cudosMainLogo = '../../../../resources/common/img/favicon/cudos-80x80.svg';
    const cudosFont = '../../../../resources/common/img/favicon/cudos-font.svg';

    return (
        <ModalComponent closeModal={closeModal} isOpen={isOpen}>
            <div className={'LoadingForm'}>
                <div className={'Wrapper'}>
                    <div className={'CudosMainLogo'} style={ProjectUtils.makeBgImgStyle(cudosMainLogo)}></div>
                </div>
                <div className={'Wrapper'}>
                    <div className={'CudosFont'} style={ProjectUtils.makeBgImgStyle(cudosFont)}></div>
                </div>
                <div className={'Wrapper'}>
                    <div className={'Title Saving'}>
                        Transfer in progress
                        <span>.</span>
                        <span>.</span>
                        <span>.</span>
                    </div>
                </div>
            </div>
        </ModalComponent>
    )
}

export default LoadingModal

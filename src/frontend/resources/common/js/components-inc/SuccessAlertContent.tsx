import React from 'react';

import ProjectUtils from '../ProjectUtils';
import '../../css/components-inc/success-alert-content.css';

const SuccessAlertContent = ({
    title,
    subtitle,
}
: {
    title: string
    subtitle: string
}) => {

    const svgSuccess = '../../../../resources/common/img/favicon/successs-icon.svg';

    return (
        <div className={'SuccessAlertContent'}>
            <div className={'Wrapper'}>
                <div className={'TransactionSuccessLogo'}style={ProjectUtils.makeBgImgStyle(svgSuccess)} ></div>
            </div>
            <div className={'Title'}>{ title }</div>
            <div className={'Subheader'}>{subtitle}</div>
        </div>
    )
}

export default SuccessAlertContent

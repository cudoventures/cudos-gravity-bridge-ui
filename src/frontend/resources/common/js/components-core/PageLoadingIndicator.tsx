import React from 'react';
import { inject, observer } from 'mobx-react';

import AppStore from '../stores/AppStore';

import LoadingIndicator from './LoadingIndicator';

import '../../css/components-core/page-loading-indicator.css';
import S from '../utilities/Main';

interface Props {
    appStore?: AppStore;
}

class PageLoadingIndicator extends React.Component < Props > {

    render() {
        return (
            <div className = { `PageLoadingIndicator FlexSingleCenter Transition ActiveVisibilityHidden ${S.CSS.getActiveClassName(this.props.appStore.loadingPage !== 0)}` }>
                <LoadingIndicator margin = { 'auto' } />
            </div>
        )
    }

}

export default inject('appStore')(observer(PageLoadingIndicator));

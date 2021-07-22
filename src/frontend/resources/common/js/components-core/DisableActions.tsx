// version 2.0.0

import React from 'react';
import { inject, observer } from 'mobx-react';

import AppStore from '../stores/AppStore';
import S from '../utilities/Main';

import '../../css/components-core/disable-actions.css';

interface Props {
    appStore: AppStore;
}

class DisableActions extends React.Component < Props > {

    render() {
        return (
            <div
                className = { `DisableActions Transition ActiveVisibilityHidden${S.CSS.getActiveClassName(this.props.appStore.hasDisabledActions())}` }
                onClick = { S.stopPropagation } >
                <label className = { 'Transition' } ></label>
            </div>
        );
    }

}

export default inject('appStore')(observer(DisableActions));

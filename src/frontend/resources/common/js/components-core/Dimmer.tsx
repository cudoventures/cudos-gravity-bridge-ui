// version 2.0.0

import React from 'react';
import { inject, observer } from 'mobx-react';

import AppStore from '../stores/AppStore';
import S from '../utilities/Main';

import '../../css/components-core/dimmer.css';

interface Props {
    appStore: AppStore;
}

class Dimmer extends React.Component < Props > {

    render() {
        return (
            <div className = { `Dim Transition ActiveVisibilityHidden ${S.CSS.getActiveClassName(this.props.appStore.hasDimmer())}` } />
        );
    }

}

export default inject('appStore')(observer(Dimmer));

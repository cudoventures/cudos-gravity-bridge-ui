import React from 'react';

import PopupPasswordStore from '../stores/PopupPasswordStore';

import PopupWindow, { PopupWindowProps } from '../components-core/PopupWindow';
import { inject, observer } from 'mobx-react';

interface Props extends PopupWindowProps {
    popupStore: PopupPasswordStore;
}

class PasswordPopup extends PopupWindow < Props > {

    getCssClassName() {
        return 'PasswordPopup PopupPadding PopupBox';
    }

    renderContent() {
        return (
            <div className = { 'PopupWindowContent' }>
                { this.props.popupStore.msg }
            </div>
        )
    }

}

export default inject((stores) => {
    return {
        popupStore: stores.popupPasswordStore,
    }
})(observer(PasswordPopup));

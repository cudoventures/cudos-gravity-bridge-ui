import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import { configure } from 'mobx'

import Config from '../../../../../../builds/dev-generated/Config';

import AppStore from '../stores/AppStore';
import AlertStore from '../stores/AlertStore';
import AccountSessionStore from '../stores/AcccountSessionStore';
import PopupPasswordStore from '../stores/PopupPasswordStore';
import Ajax from '../utilities/Ajax';
import S from '../utilities/Main';

import PageLayoutComponent from './PageLayoutComponent';
import NetworkStore from '../stores/NetworkStore';

configure({
    enforceActions: 'never',
})

export interface PageComponentProps {
    appStore?: AppStore,
    alertStore?: AlertStore,
}

export default class PageComponent < Pr extends PageComponentProps, St = {}, SS = any > extends React.Component < Pr, St, SS > {

    static layout(componentNode: React.ReactNode) {
        ReactDOM.render((
            <Provider
                appStore = { new AppStore() }
                accountSessionStore = { new AccountSessionStore() }
                alertStore = { new AlertStore() }
                popupPasswordStore = { new PopupPasswordStore() }
                networkStore = { new NetworkStore() }
            >

                { componentNode }

            </Provider>
        ), document.querySelector('.ReactEntryPoint'));
    }

    constructor(props: Pr) {
        super(props);

        this.props.appStore.incrementLoading();
        initHover();
        initOnBeforeUnload();
    }

    componentDidMount() {
        this.loadData();
        this.removeInitalPageLoading();
    }

    loadData() {
        return new Promise < void >((resolve, reject) => {
            const ajax = new Ajax();

            ajax.open(Ajax.GET, `${Config.URL.RESOURCES}/common/fonts/BasierCircle-Regular.woff2`, true);
            ajax.onResponse = () => {
                this.props.appStore.decrementLoading();
                resolve();
            };
            ajax.send();

        });
    }

    removeInitalPageLoading() {
        const pageLoadingN = document.getElementById('page_loading');
        pageLoadingN?.parentNode?.removeChild(pageLoadingN);
    }

    getPageLayoutComponentCssClassName() {
        return S.Strings.EMPTY;
    }

    render() {
        return (
            <PageLayoutComponent
                className = { `${this.getPageLayoutComponentCssClassName()} Transition` }
                popups = { this.renderPopups() } >

                { this.renderContent() }

            </PageLayoutComponent>
        );
    }

    renderContent(): React.ReactNode | null {
        return null;
    }

    renderPopups() {
        return [];
    }

}

function initHover() {
    if (navigator.maxTouchPoints === 0 || navigator.msMaxTouchPoints === 0) {
        return;
    }

    let touch = false;
    let timerId: any = null;
    const timerCallback = () => {
        touch = false;
    };

    document.documentElement.addEventListener('mousemove', (e) => {
        if (touch === false) { S.CSS.removeClass(document.documentElement, 'Touchable'); }
    }, true);

    document.documentElement.addEventListener('touchstart', () => {
        touch = true;
        if (timerId !== null) {
            clearTimeout(timerId);
        }
        S.CSS.addClass(document.documentElement, 'Touchable');
    }, true);

    document.documentElement.addEventListener('touchend', () => {
        if (timerId !== null) {
            clearTimeout(timerId);
        }
        timerId = setTimeout(timerCallback, 256);
    });
}

function initOnBeforeUnload() {
    let loadedFromCache = false;

    window.onbeforeunload = (e: BeforeUnloadEvent) => {
        const defaultReturnValue = e.returnValue;

        if (S.Browser.instance_name === S.Browser.SAFARI) {
            document.body.style.opacity = '0';
        }

        if (loadedFromCache === true) {
            e.returnValue = defaultReturnValue;
            return;
        }

        if (e.returnValue !== defaultReturnValue) {
            setTimeout(() => {
                setTimeout(() => {
                    setTimeout(() => {
                        setTimeout(() => {
                            setTimeout(() => {
                                if (S.Browser.instance_name === S.Browser.SAFARI) {
                                    document.body.style.opacity = '1';
                                }
                            }, 20);
                        }, 20);
                    }, 20);
                }, 20);
            }, 20);
        }
    };
    window.onpageshow = (e: PageTransitionEvent) => {
        loadedFromCache = e.persisted;
        if (e.persisted) {
            window.location.reload();
        }
    };
}

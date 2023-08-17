import { makeAutoObservable } from 'mobx';
import S from '../utilities/Main';

export default class AlertStore {

    visible: boolean = false;
    msg: any | null = null;
    title: any | null = null;
    subtitle: any | null = null;
    positiveLabel: string | null = null;
    positiveListener: null | (() => boolean | void) = null;
    negativeLabel: string | null = null;
    negativeListener: null | (() => boolean | void) = null;
    neutralLabel: string | null = null;
    neutralListener: null | (() => boolean | void) = null;

    constructor() {
        makeAutoObservable(this);
    }

    isVisible() {
        return this.visible;
    }

    hasAnyButton() {
        return this.negativeLabel !== null || this.positiveLabel !== null || this.negativeLabel !== null;
    }

    show = (msg: any, positiveListener : null | (() => boolean | void) = null, negativeListener: null | (() => boolean | void) = null) => {
        this.msg = msg;
        this.title = null;
        this.subtitle = null;
        this.showSignal(positiveListener, negativeListener);
    }

    showWithTitles = (title: string, subtitle: string, positiveListener : null | (() => boolean | void) = null, negativeListener: null | (() => boolean | void) = null) => {
        this.msg = null;
        this.title = title;
        this.subtitle = subtitle;
        this.showSignal(positiveListener, negativeListener);
    }

    showSignal(positiveListener : null | (() => boolean | void) = null, negativeListener: null | (() => boolean | void) = null) {
        this.positiveLabel = 'Ok';
        if (positiveListener !== null) {
            this.positiveListener = positiveListener;
        }
        if (negativeListener !== null) {
            this.negativeLabel = 'Cancel';
            this.negativeListener = negativeListener;
        }
        this.visible = true;
    }

    hide = () => {
        this.visible = false;
        this.msg = S.Strings.EMPTY;
        this.title = null;
        this.subtitle = null;
        this.positiveLabel = this.neutralLabel = this.negativeLabel = null;
        this.positiveListener = this.neutralListener = this.negativeListener = null;
    }

}

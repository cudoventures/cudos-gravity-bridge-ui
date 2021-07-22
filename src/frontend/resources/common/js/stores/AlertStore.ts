import { makeAutoObservable } from 'mobx';
import S from '../utilities/Main';

export default class AlertStore {

    visible: boolean = false;
    msg: string | null = null;
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

    show = (msg: string, positiveListener : null | (() => boolean | void) = null, negativeListener: null | (() => boolean | void) = null) => {
        this.msg = msg;
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
        this.positiveLabel = this.neutralLabel = this.negativeLabel = null;
        this.positiveListener = this.neutralListener = this.negativeListener = null;
    }

}

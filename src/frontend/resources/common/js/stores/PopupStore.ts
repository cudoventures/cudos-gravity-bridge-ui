import { makeObservable, observable } from 'mobx';

export default class PopupStore {

    @observable visible: boolean = false;

    constructor() {
        makeObservable(this);
    }

    hide = () => {
        this.visible = false;
    }

}

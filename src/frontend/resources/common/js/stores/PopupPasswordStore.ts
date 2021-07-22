import { makeObservable, observable } from 'mobx';
import PopupStore from './PopupStore';

export default class PopupPasswordStore extends PopupStore {

    @observable msg: string = 'test';

    constructor() {
        super();
        makeObservable(this);
    }

}

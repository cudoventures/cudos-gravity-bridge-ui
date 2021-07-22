import { makeAutoObservable } from 'mobx';
import AccountModel from '../models/AccountModel';

export default class AccountSessionStore {

    accountModel: AccountModel | null = null;

    constructor() {
        makeAutoObservable(this);
    }

}

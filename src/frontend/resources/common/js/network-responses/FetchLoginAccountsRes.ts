import AccountModel from '../models/AccountModel';

export default class FetchLoginAccountsRes {

    account: AccountModel;

    constructor(json) {
        this.account = AccountModel.fromJSON(json.account);
    }

}

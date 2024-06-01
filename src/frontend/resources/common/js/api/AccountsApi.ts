import Api from "../utilities/Api";

import CookieHelper from "../helpers/CookieHelper";

import AccountModel from "../models/AccountModel";
import FetchLoginAccountsRes from "../network-responses/FetchLoginAccountsRes";
import Apis from "../../../../../../builds/dev-generated/Apis";
import Actions from "../../../../../../builds/dev-generated/Actions";
import AbsApi from "./AbsApi";

export default class AccountsApi extends AbsApi {
  /* new api */
  fetchLoginAccounts(callback: (account: AccountModel) => void) {
    setTimeout(() => {
      const accounts = CookieHelper.fetchAccounts();

      const json = {
        account:
          accounts.accountModel === null
            ? null
            : accounts.accountModel.toJSON(),
      };

      const res = new FetchLoginAccountsRes(json);
      callback(res.account);
    }, 100);
  }

  logout() {
    CookieHelper.saveAccounts(null);
    window.location.reload();
  }

  test() {
    const api = new Api(Apis.GENERAL, this.enableActions, this.disableActions);

    api.req(
      Actions.GENERAL.LOGIN,
      { something: "2" },
      (json: any) => {
        console.log(json);
      },
      Api.TYPE_JSON
    );
  }
}

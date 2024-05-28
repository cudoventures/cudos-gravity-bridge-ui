import AccountModel from "../models/AccountModel";

const COOKIE_STORAGE = "mogul_cookies";

export default class CookieHelper {
  static saveAccounts(accountModel) {
    const storage = Storage.open();
    storage.accountModel = accountModel;
    Storage.save(storage);
  }

  static fetchAccounts() {
    const storage = Storage.open();
    return {
      accountModel: storage.accountModel,
    };
  }
}

class Storage {
  constructor() {
    this.version = 1;
    this.accountModel = null;
  }

  static open() {
    const result = new Storage();
    const json = localStorage.getItem(COOKIE_STORAGE);
    if (json !== null) {
      result.parse(JSON.parse(json));
    }

    return result;
  }

  static save(value) {
    const date = new Date();
    date.setFullYear(date.getFullYear() + 1);
    localStorage.setItem(COOKIE_STORAGE, JSON.stringify(value), date);
  }

  parse(json) {
    this.version = json.version;
    this.accountModel = AccountModel.fromJSON(json.accountModel);
  }
}

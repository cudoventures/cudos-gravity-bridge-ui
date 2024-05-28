import S from "../utilities/Main";

export default class AccountModel {
  accountId: string;
  email: string;

  constructor() {
    this.accountId = S.Strings.NOT_EXISTS;
    this.email = S.Strings.EMPTY;
  }

  clone(): AccountModel {
    return Object.assign(new AccountModel(), this);
  }

  toJSON(): any {
    return {
      accountId: this.accountId,
      email: this.email,
    };
  }

  static fromJSON(json): AccountModel {
    if (json === null) {
      return null;
    }

    const model = new AccountModel();

    model.accountId = (json.accountId || model.accountId).toString();
    model.email = json.email || model.email;

    return model;
  }
}

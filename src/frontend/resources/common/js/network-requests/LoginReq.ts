export default class ReqLogin {
  login: string;
  pass: string;

  constructor(login_: string, pass_: string) {
    this.login = login_;
    this.pass = pass_;
  }
}

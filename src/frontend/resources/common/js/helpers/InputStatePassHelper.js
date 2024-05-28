import S from "../utilities/Main";

export default class InputStatePassHelper {
  constructor(allowEmpty, callback = null) {
    this.allow_empty = allowEmpty;
    this.callback = callback;

    this.values = new Map();
    this.errors = new Map();
    this.onChanges = new Map();

    KEYS.forEach(key => {
      this.values.set(key, S.Strings.EMPTY);
      this.errors.set(key, false);
      this.onChanges.set(key, this.onChange.bind(this, key));
    });
  }

  setParentCallbacks(callback) {
    this.callback = callback;
  }

  onChange(key, value) {
    this.values.set(key, value);
    this.markAsValid();
  }

  getPass() {
    const pass = this.values.get(InputStatePassHelper.KEY_PASS);
    const repeatPass = this.values.get(InputStatePassHelper.KEY_REPEAT_PASS);

    if (pass === S.Strings.EMPTY && repeatPass === S.Strings.EMPTY) {
      if (this.allow_empty === false) {
        this.markAsError();
        return null;
      }
      return S.Strings.EMPTY;
    }

    if (pass !== repeatPass) {
      this.markAsError();
      return null;
    }

    return pass;
  }

  markAsValid() {
    KEYS.forEach(key => {
      this.errors.set(key, false);
    });
    this.callback();
  }

  markAsError() {
    KEYS.forEach(key => {
      this.errors.set(key, true);
    });
    this.callback();
  }

  setPass(value) {
    this.values.set(InputStatePassHelper.KEY_PASS, value);
    this.values.set(InputStatePassHelper.KEY_REPEAT_PASS, value);
    this.callback();
  }
}

InputStatePassHelper.KEY_PASS = "pass";
InputStatePassHelper.KEY_REPEAT_PASS = "r_pass";

const KEYS = [
  InputStatePassHelper.KEY_PASS,
  InputStatePassHelper.KEY_REPEAT_PASS,
];

const SV = require("./SV");
const crypto = require("crypto");
const aesjs = require("aes-js");

const ENCRYPTION_KEY = [
  3, 5, 1, 10, 20, 54, 20, 4, 11, 15, 0, 1, 52, 15, 23, 41,
];

export default class SF {
  static hashPassword(password, salt) {
    return new Promise((resolve, reject) => {
      crypto.pbkdf2(password, salt, 100000, 64, "sha512", (err, derivedKey) => {
        if (err) {
          reject(err);
        }

        resolve(derivedKey.toString("hex"));
      });
    });
  }

  static generateSalt() {
    return new Promise((resolve, reject) => {
      return crypto.randomBytes(128, (err, buf) => {
        if (err) {
          reject(err);
        }

        resolve(buf.toString("hex"));
      });
    });
  }

  static passwordValidation(password) {
    return true;
  }

  static hashContent(content) {
    const hash = crypto.createHash("sha256");
    hash.update(content);
    return hash.digest("hex");
  }

  static encrypt(plainString) {
    const bytes = aesjs.utils.utf8.toBytes(plainString);
    const aesCtr = new aesjs.ModeOfOperation.ctr(
      ENCRYPTION_KEY,
      new aesjs.Counter(5)
    );
    const encryptedBytes = aesCtr.encrypt(bytes);
    return aesjs.utils.hex.fromBytes(encryptedBytes);
  }

  static descrypt(encryptedHex) {
    const encryptedBytes = aesjs.utils.hex.toBytes(encryptedHex);
    const aesCtr = new aesjs.ModeOfOperation.ctr(
      ENCRYPTION_KEY,
      new aesjs.Counter(5)
    );
    const decryptedBytes = aesCtr.decrypt(encryptedBytes);
    return aesjs.utils.utf8.fromBytes(decryptedBytes);
  }
}

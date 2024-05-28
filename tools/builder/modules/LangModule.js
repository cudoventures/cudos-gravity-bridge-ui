const cp = require("child_process");

const Config = require("./../../../config/config");

class LangModule {
  static process(targetPathObj) {
    return new Promise((resolve, reject) => {
      const process = cp.fork(
        `${Config.Path.LANG}/Main.js`,
        [targetPathObj.Backend.UTILITIES],
        { silent: true }
      );
      process.stdout.on("data", data => console.log(data.toString()));
      process.stderr.on("data", data => console.log(data.toString()));
      process.on("exit", () => {
        resolve();
      });
    });
  }
}

module.exports = LangModule;

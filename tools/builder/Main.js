const Config = require("./../../config/config");

const ArgvHelper = require("./helpers/ArgvHelper");
const DevTarget = require("./targets/DevTarget");
const ProdTarget = require("./targets/ProdTarget");

async function main() {
  const functor = ArgvHelper.DEV === true ? DevTarget.run : ProdTarget.run;

  try {
    await functor();
  } catch (e) {
    console.error(e);
  }
}

main();

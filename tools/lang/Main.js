const fs = require("fs");
const path = require("path");
const EOL = require("os").EOL;

const Config = require("./../../config/config");
const { langs, readTxtData } = require("./Utilities");

const langsData = readTxtData();

/* Validate keys */
const mergedKeys = {};
let counter = 0;
for (let i = langsData.length; i-- > 0; ) {
  const keys = langsData[i].keys;
  for (let j = keys.length; j-- > 0; ) {
    if (mergedKeys[keys[j]] !== undefined) {
      continue;
    }

    for (let k = langsData.length; k-- > 0; ) {
      if (i === k) {
        continue;
      }

      const targetKeysMap = langsData[k].keysMap;
      if (targetKeysMap[keys[j]] !== null) {
        console.log(`The key ${keys[j]} is missing in ${langs[k]}.xlsx`);
      }
    }

    mergedKeys[keys[j]] = ++counter;
  }
}

/* Generating tr.js */
const trFile = fs.openSync(path.join(process.argv[2], "TR.js"), "w");

fs.writeSync(trFile, `// This is auto generated file, do NOT modify it${EOL}`);
fs.writeSync(trFile, `const TR = {${EOL}`);
fs.writeSync(trFile, `\tEN: {},${EOL}`);
fs.writeSync(trFile, `\tBG: {},${EOL}`);
fs.writeSync(trFile, `}${EOL}`);
fs.writeSync(trFile, EOL);

for (let i = langs.length; i-- > 0; ) {
  for (let j = 0; j < langsData[i].keys.length; ++j) {
    fs.writeSync(
      trFile,
      `TR.${langs[i].toUpperCase()}.${langsData[i].keys[j]} = '${langsData[i].values[j].replace(/'/g, "\\'")}';${EOL}`
    );
  }

  fs.writeSync(trFile, EOL);
}

fs.writeSync(trFile, EOL);
fs.writeSync(trFile, `module.exports = TR;${EOL}`);

fs.closeSync(trFile);

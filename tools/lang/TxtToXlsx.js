const fs = require("fs");
const xlsx = require("node-xlsx");
const Config = require("./../../config/config");
const { langs, readTxtData } = require("./Utilities");

const langsData = readTxtData();

const xlsxOptons = { "!cols": [{ wch: 54 }, { wch: 84 }, { wch: 30 }] };

for (let i = langsData.length; i-- > 0; ) {
  const langData = langsData[i];
  const excelData = new Array(langData.keys.length + 1);

  excelData[0] = ["Key", langs[i].toUpperCase(), "Usage"];
  for (let j = excelData.length - 1; j-- > 0; ) {
    excelData[j + 1] = [
      langData.keys[j],
      langData.values[j],
      langData.usage[j],
    ];
  }

  const buffer = xlsx.build([{ name: langs[i], data: excelData }], xlsxOptons);
  if (fs.existsSync(`${Config.Path.LANG}/xlsx/`) === false) {
    fs.mkdirSync(`${Config.Path.LANG}/xlsx/`);
  }
  fs.writeFileSync(`${Config.Path.LANG}/xlsx/${langs[i]}.xlsx`, buffer);
}

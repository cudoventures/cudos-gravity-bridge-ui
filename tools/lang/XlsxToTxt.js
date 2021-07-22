const fs = require('fs');
const xlsx = require('node-xlsx');
const Config = require('./../../config/config');
const { validateData, langs } = require('./Utilities');

for (let i = langs.length; i-- > 0;) {
    const sheets = xlsx.parse(`${Config.Path.LANG}/xlsx/${langs[i]}.xlsx`);
    const sheetData = sheets[0].data;
    const out = fs.openSync(`${Config.Path.LANG}/txt/${langs[i]}.txt`, 'w');

    for (let j = 1; j < sheetData.length; ++j) {
        if (sheetData[j].length < 2) {
            console.error('Translation/Ussage missing for:', sheetData[j]);
            continue;
        }

        let key = sheetData[j][0];
        let value = sheetData[j][1];
        let usage = sheetData[j][2];

        if (key === undefined || value === undefined) { // empty line
            continue;
        }

        key = key.trim();
        value = value.trim();
        if (key === '' || value === '') {
            console.error('Translation/Ussage missing for:', sheetData[j]);
            continue;
        }

        usage = usage === undefined ? '' : usage.trim();
        if (validateData(key, value, usage) === false) {
            continue;
        }

        fs.writeSync(out, `${usage.replace(/ +/g, ' ')}:${key} = ${value.replace(/ +/g, ' ')}\n`);
    }

    fs.closeSync(out);
}

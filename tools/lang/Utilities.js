const fs = require('fs');
const Config = require('./../../config/config');

const langs = ['en', 'bg'];

function validateKey(key) {
    for (let i = key.length; i-- > 0;) {
        if (key[i] === '_') {
            continue;
        }
        if (key[i] >= 'A' && key[i] <= 'Z') {
            continue;
        }
        if (key[i] >= '0' && key[i] <= '9') {
            continue;
        }
        return false;
    }

    return true;
}

function validateData(key, value, usage) {
    if (validateKey(key) === false) {
        console.error(`The key must contains only A-Z, 0-9, _ (${key})`);
        return false;
    }

    if (value.indexOf('\\') !== -1 || value.indexOf('\n') !== -1) {
        console.error(`Translated value must not contain \\ or new line (${value})`);
        return false;
    }

    if (usage.indexOf(':') !== -1) {
        console.error(`Usage MUST not contain : (${usage})`);
        return false;
    }

    return true;
}

function readTxtData() {
    const langData = new Array(langs.length);

    for (let i = langData.length; i-- > 0;) {
        const data = {
            'keys': [],
            'values': [],
            'usage': [],
            'keysMap': {},
        };

        const fileContent = fs.readFileSync(`${Config.Path.LANG}/txt/${langs[i]}.txt`).toString();
        const lines = fileContent.split('\n');

        for (let j = 0; j < lines.length; ++j) {
            const line = lines[j].trim();
            if (line.length === 0) { // skip last empty line
                continue;
            }

            let usageEnd = line.indexOf(':');
            usageEnd = usageEnd === -1 ? 0 : usageEnd;
            const keyEnd = line.indexOf('=', usageEnd);

            const usage = line.substring(0, usageEnd);
            const key = line.substring(usageEnd + (line[usageEnd] === ':' ? 1 : 0), keyEnd).trim();
            const value = line.substring(keyEnd + 1).trim();

            if (validateData(key, value, usage) === false) {
                continue;
            }

            data.keys.push(key);
            data.values.push(value);
            data.usage.push(usage);
            data.keysMap[key] = null;
        }

        langData[i] = data;
    }

    return langData;
}

module.exports = {
    'langs': langs,
    'validateData': validateData,
    'readTxtData': readTxtData,
};

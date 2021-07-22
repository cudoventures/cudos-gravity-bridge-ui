const fs = require('fs');
const path = require('path');
const markoCompiler = require('marko/compiler');

const Config = require('./../../../config/config');
const FileHelper = require('../helpers/FileHelper');

class MarkoModule {

    static async process(targetPath) {
        const sourcePath = Config.Path.Root.Frontend.PAGES;
        fs.mkdirSync(targetPath, { 'recursive': true });

        const items = fs.readdirSync(sourcePath);
        for (let i = items.length; i-- > 0;) {
            FileHelper.traversePath(path.join(sourcePath, items[i]), path.join(targetPath, items[i]), null, true, (sourceChildPath, targetChildPath) => {
                MarkoModule.processFile(sourceChildPath, targetPath);
            });
        }
    }

    static processFile(sourceChildPath, targetPath) {
        const targetChildPath = sourceChildPath.replace(Config.Path.Root.Frontend.PAGES, targetPath);

        if (fs.existsSync(sourceChildPath) === true) {
            const timestamp = new Date().getTime();
            let compiled = markoCompiler.compileFile(sourceChildPath);
            compiled = compiled.replace('/vendor.css', `/vendor.css?${timestamp}`).replace('/vendor.js', `/vendor.js?${timestamp}`);
            compiled = compiled.replace('/bundle.css', `/bundle.css?${timestamp}`).replace('/bundle.js', `/bundle.js?${timestamp}`);
            const folderPath = path.dirname(targetChildPath);
            if (fs.existsSync(folderPath) === false) {
                fs.mkdirSync(folderPath);
            }
            fs.writeFileSync(`${targetChildPath}.js`, compiled);
            compiled = null;
        } else if (fs.existsSync(targetChildPath)) {
            fs.unlinkSync(targetChildPath);
        }
    }

    static match(targetPath) {
        if (targetPath.indexOf(Config.Path.Root.Frontend.PAGES) === -1) { // Escape Marko files in backend
            return false;
        }

        return targetPath.match(/\.marko$/) !== null;
    }

}

module.exports = MarkoModule;

const fs = require('fs');
const path = require('path');

const Config = require('./../../../config/config');

const FileHelper = require('../helpers/FileHelper');

class ResourcesModule {

    static async process(targetPath) {
        const sourcePath = Config.Path.Root.Frontend.RESOURCES;

        const items = fs.readdirSync(sourcePath);
        let sourceChildPath, targetChildPath;
        let exception;

        for (let i = items.length; i-- > 0;) {
            sourceChildPath = path.join(sourcePath, items[i]);
            if (fs.statSync(sourceChildPath).isDirectory() === false) {
                continue;
            }

            targetChildPath = path.join(targetPath, items[i]);
            exception = {
                include: [path.join(sourceChildPath, 'css/inline')],
                exclude: [path.join(sourceChildPath, 'css'), path.join(sourceChildPath, 'js')],
            };
            await FileHelper.copyFiles(sourceChildPath, targetChildPath, exception);
        }
    }

    static match(targetPath) {
        if (targetPath.indexOf(Config.Path.Root.Frontend.RESOURCES) !== 0) {
            return false;
        }
        if (targetPath.indexOf('css') !== -1 && targetPath.indexOf('inline') === -1) {
            return false;
        }
        return targetPath.indexOf('js') === -1;
    }

    static processFile(sourcePath) {
        const targetPath = sourcePath.replace(Config.Path.Root.Frontend.RESOURCES, Config.Path.Dev.Frontend.RESOURCES);
        if (fs.existsSync(sourcePath) === true) {
            fs.copyFileSync(sourcePath, targetPath);
        } else if (fs.existsSync(targetPath) === true) {
            fs.unlinkSync(targetPath);
        }
    }

}

module.exports = ResourcesModule;

const fs = require('fs');
const path = require('path');

const Config = require('../../../config/config');

const ArgvHelper = require('../helpers/ArgvHelper');
const ServerHelper = require('../helpers/ServerHelper');
const FileHelper = require('../helpers/FileHelper');
const WatchHelper = require('../helpers/WatchHelper');

const RootModule = require('../modules/RootModule');
const MarkoModule = require('../modules/MarkoModule');
const ResourcesModule = require('../modules/ResourcesModule');
const DevGeneratedModule = require('../modules/DevGeneratedModule');
const WebpackModule = require('../modules/WebpackModule');
const LangModule = require('../modules/LangModule');

class ProdTarget {

    static async run() {
        await FileHelper.init(Config.Path.Prod, Config.Path.PROD);
        await RootModule.process(Config.Path.PROD);
        await MarkoModule.process(Config.Path.Prod.Frontend.PAGES);
        await ResourcesModule.process(Config.Path.Prod.Frontend.RESOURCES);
        await DevGeneratedModule.process(Config.Path.Prod);
        await new WebpackModule(null, Config.Path.Prod).process();
        await LangModule.process(Config.Path.Prod);

        fs.copyFileSync(path.join(Config.Path.ROOT, 'package.json'), path.join(Config.Path.PROD, 'package.json'));
        fs.copyFileSync(path.join(Config.Path.ROOT, 'package-lock.json'), path.join(Config.Path.PROD, 'package-lock.json'));
        FileHelper.traversePath(path.join(Config.Path.PROD, 'config'), '', null, false, (sourceChildPath) => {
            if (path.basename(sourceChildPath) !== 'config.js') {
                fs.unlinkSync(sourceChildPath);
            }
        });
    }

}

module.exports = ProdTarget;

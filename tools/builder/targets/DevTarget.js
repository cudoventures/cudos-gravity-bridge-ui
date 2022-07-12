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

class DevTarget {

    static async run() {
        const serverHelper = (ArgvHelper.START_SERVER === true ? new ServerHelper() : null);

        if (ArgvHelper.DB_FOLDER_CLEAN === true) {
            await FileHelper.cleanDBFolder();
        }

        if (ArgvHelper.WEBPACK === true) {
            if (ArgvHelper.ENTRY_POINTS === null) {
                await FileHelper.init(Config.Path.Dev, Config.Path.DEV);
            }
        }

        await RootModule.process(Config.Path.DEV);

        if (ArgvHelper.SERVER === true) {
            await MarkoModule.process(Config.Path.Dev.Frontend.PAGES);
            await ResourcesModule.process(Config.Path.Dev.Frontend.RESOURCES);
        }

        if (ArgvHelper.WEBPACK === true) {
            await DevGeneratedModule.process(Config.Path.Dev);
            await new WebpackModule(serverHelper, Config.Path.Dev).process();
        }

        if (ArgvHelper.SERVER === true) {
            await LangModule.process(Config.Path.Dev);
        }

        if (ArgvHelper.WATCH === true) {
            WatchHelper.watch(serverHelper);
        }

        if (serverHelper !== null) {
            serverHelper.start();

            process.on('SIGINT', async () => {
                await serverHelper.stop();
                process.exit(0);
            })
            process.on('SIGTERM', async () => {
                await serverHelper.stop();
                process.exit(0);
            })
        }
    }

}

module.exports = DevTarget;

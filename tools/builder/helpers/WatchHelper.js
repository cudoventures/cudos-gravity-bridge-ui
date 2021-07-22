const fs = require('fs');
const watch = require('node-watch');
const path = require('path');

const Config = require('./../../../config/config');

const MarkoModule = require('../modules/MarkoModule');
const ResourcesModule = require('../modules/ResourcesModule');
const RootModule = require('../modules/RootModule');
const DevGeneratedModule = require('../modules/DevGeneratedModule');
const LangModule = require('../modules/LangModule');

class WatchModule {

    static watch(serverHelper) {
        let timeoutSrc = null;
        let timeoutXlsx = null;

        watch(Config.Path.Root.SRC, {
            recursive: true,
        }, (event, filename) => {
            if (timeoutSrc !== null) {
                clearTimeout(timeoutSrc);
            }

            timeoutSrc = setTimeout(async () => {
                try {
                    if (filename === null || path.extname(filename) === '') {
                        return;
                    }

                    const targetPath = filename;

                    let modified = false;

                    if (MarkoModule.match(targetPath) === true) {
                        MarkoModule.processFile(targetPath, Config.Path.Dev.Frontend.PAGES);
                        modified = true;
                    } else if (ResourcesModule.match(targetPath) === true) {
                        ResourcesModule.processFile(targetPath);
                        modified = true;
                    } else if (RootModule.match(targetPath) === true) {
                        RootModule.processFile(targetPath, undefined, Config.Path.DEV);
                        modified = true;
                    }

                    await DevGeneratedModule.matchAndProcess(targetPath, Config.Path.Dev); // no need to restart server from here, because it is triggered from either webpack or RootModule

                    if (serverHelper !== null && modified === true) {
                        serverHelper.restart();
                    }
                } catch (e) {
                    console.warn(e);
                }

            }, WatchModule.TIMEOUT_DELAY);
        });

        watch(path.join(Config.Path.LANG, 'txt'), {
            recursive: true,
        }, (event, filename) => {
            console.log(filename, event);
            if (path.extname(filename) !== '.txt' || (event !== 'change' && event !== 'update')) {
                return;
            }

            if (timeoutXlsx !== null) {
                clearTimeout(timeoutXlsx);
            }

            timeoutXlsx = setTimeout(async () => {
                await LangModule.process(Config.Path.Dev);
                if (serverHelper !== null) {
                    serverHelper.restart();
                }
            }, WatchModule.TIMEOUT_DELAY);
        });
    }

}

WatchModule.TIMEOUT_DELAY = 250;

module.exports = WatchModule;

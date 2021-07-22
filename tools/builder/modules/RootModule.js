const path = require('path');
const fs = require('fs');
const util = require('util');

const existsAsync = util.promisify(fs.exists);

const Babel = require('@babel/core');

const Config = require('./../../../config/config');

const FileHelper = require('../helpers/FileHelper');
const MarkoModule = require('./MarkoModule');
const ArgvHelper = require('../helpers/ArgvHelper');

class RootModule {

    static async process(configTargetPath) {
        await FileHelper.traversePath(Config.Path.ROOT, configTargetPath, serverExclude, true, (sourceChildPath, targetChildPath) => {
            RootModule.processFile(sourceChildPath, targetChildPath, configTargetPath);
        });
    }

    static match(targetPath) {
        targetPath = path.normalize(targetPath);
        for (let i = serverExclude.length; i-- > 0;) {
            if (targetPath.indexOf(serverExclude[i]) !== -1) {
                return false;
            }
        }

        return true;
    }

    static processFile(sourceChildPath, targetChildPath, configTargetPath) {
        if (targetChildPath === undefined) {
            targetChildPath = sourceChildPath.replace(Config.Path.ROOT, configTargetPath);
        }

        if ((fs.existsSync(sourceChildPath)) === true) {
            if (sourceChildPath.includes(path.normalize('/db/migrations/'))) {
                fs.copyFileSync(sourceChildPath, targetChildPath);
            } else if (sourceChildPath.includes(path.normalize('/frontend/'))) {
                fs.copyFileSync(sourceChildPath, targetChildPath);
            } else {
                const fileExtension = path.extname(sourceChildPath);
                switch (fileExtension) {
                    case '.ts':
                        try {
                            const content = fs.readFileSync(sourceChildPath);
                            const trContent = Babel.transform(content, {
                                presets: ['@babel/typescript'],
                                plugins: ['@babel/plugin-transform-modules-commonjs'],
                                'configFile': false,
                                'babelrc': false,
                                'sourceMaps': ArgvHelper.DEV === true ? 'inline' : false,
                                'sourceFileName': path.basename(sourceChildPath),
                                'sourceRoot': path.dirname(sourceChildPath),
                                'filename': path.basename(sourceChildPath),
                            });

                            let outputCode = trContent.code;
                            if (ArgvHelper.DEV === true) {
                                outputCode = `require('source-map-support').install(); ${outputCode}`;
                            }

                            fs.writeFileSync(targetChildPath.replace('.ts', '.js'), outputCode);
                        } catch (e) {
                            console.warn(e);
                        }
                        break;
                    case '.marko':
                        MarkoModule.processFile(sourceChildPath, targetChildPath);
                        break;
                    default:
                        fs.copyFileSync(sourceChildPath, targetChildPath);
                }
            }
        } else if (fs.existsSync(targetChildPath)) {
            fs.unlinkSync(targetChildPath);
        }
    }

}

const serverExclude = [
    path.join(Config.Path.ROOT, '/.git'),
    path.join(Config.Path.ROOT, '/builds'),
    path.join(Config.Path.ROOT, '/docs'),
    path.join(Config.Path.ROOT, '/config/nginx'),
    path.join(Config.Path.ROOT, '/config/.env.example'),
    path.join(Config.Path.ROOT, '/data'),
    path.join(Config.Path.ROOT, '/flow-typed'),
    path.join(Config.Path.ROOT, '/node_modules'),
    path.join(Config.Path.ROOT, '/src/frontend'),
    path.join(Config.Path.ROOT, '/tests'),
    path.join(Config.Path.ROOT, '/tools'),
];

module.exports = RootModule;

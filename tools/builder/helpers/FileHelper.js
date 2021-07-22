const fs = require('fs');
const path = require('path');
const util = require('util');

const existsAsync = util.promisify(fs.exists);

const Config = require('./../../../config/config');

class FileHelper {

    static async cleanDBFolder() {
        const dbFolderPath = path.join(Config.Path.DEV, 'src/backend/db');
        if (await existsAsync(dbFolderPath) !== false) {
            await FileHelper.clearPath(dbFolderPath);
        }
    }

    static init(configTargetObj, configTargetPath) {
        if (fs.existsSync(configTargetPath) === false) {
            FileHelper.mkdirsSync(configTargetPath);
        } else {
            FileHelper.clearPath(configTargetPath);
        }

        FileHelper.mkdirsSync(configTargetObj.LOGS);
    }

    static initDevGenerated() {
        if (fs.existsSync(Config.Path.Builds.DEV_GENERATED) === false) {
            FileHelper.mkdirsSync(Config.Path.Builds.DEV_GENERATED);
        } else {
            FileHelper.clearPath(Config.Path.Builds.DEV_GENERATED);
        }
    }

    static clearPath(targetPath) {
        const items = fs.readdirSync(targetPath);
        for (let childPath, i = items.length; i-- > 0;) {
            childPath = path.join(targetPath, items[i]);
            if (childPath.indexOf(Config.Path.Dev.DATA) === 0) {
                continue;
            }

            if (fs.statSync(childPath).isDirectory() === true) {
                FileHelper.clearPath(childPath);
                fs.rmdirSync(childPath);
            } else {
                fs.unlinkSync(childPath);
            }
        }
    }

    static removeDir(targetPath) {
        FileHelper.clearPath(targetPath);
        fs.rmdirSync(targetPath);
    }

    static traversePath(sourcePath, targetPath, exception, mkTargetDirs, callback) {
        let sourceChildPath;
        let targetChildPath;

        const items = fs.readdirSync(sourcePath);

        for (let i = items.length; i-- > 0;) {
            sourceChildPath = path.join(sourcePath, items[i]);
            if (FileHelper.isException(exception, sourceChildPath) === true) {
                continue;
            }

            targetChildPath = path.join(targetPath, items[i]);
            if (fs.statSync(sourceChildPath).isDirectory() === true) {
                FileHelper.traversePath(sourceChildPath, targetChildPath, exception, mkTargetDirs, callback);
            } else if (sourcePath !== Config.Path.ROOT) { // files in root folder should never be processed for now
                if (mkTargetDirs === true) {
                    FileHelper.mkdirsSync(FileHelper.computeParentPath(targetChildPath));
                }
                callback(sourceChildPath, targetChildPath);
            }
        }
    }

    static copyFiles(sourcePath, targetPath, exception) {
        FileHelper.traversePath(sourcePath, targetPath, exception, true, (sourceChildPath, targetChildPath) => {
            fs.copyFileSync(sourceChildPath, targetChildPath);
        });
    }

    static isException(exception, targetPath) {
        if (exception === null) {
            return false;
        }

        targetPath = path.join(targetPath);

        let includeList;
        let excludeList;
        if (exception.length !== undefined) {
            includeList = [];
            excludeList = exception;
        } else {
            includeList = exception.include;
            excludeList = exception.exclude;
            // console.log(includeList[0], targetPath);
        }


        for (let i = includeList.length; i-- > 0;) {
            if (targetPath.indexOf(includeList[i]) === 0 || includeList[i].indexOf(targetPath) === 0) {
                return false;
            }
        }

        for (let i = excludeList.length; i-- > 0;) {
            if (targetPath.indexOf(excludeList[i]) === 0) {
                return true;
            }
        }

        return false;
    }

    static mkdirsSync(targetPath) {
        if (fs.existsSync(targetPath) === true) {
            return;
        }

        FileHelper.mkdirsSync(FileHelper.computeParentPath(targetPath));
        fs.mkdirSync(targetPath);
    }

    static computeParentPath(targetPath) {
        return path.join(targetPath, '..');
    }

}

module.exports = FileHelper;

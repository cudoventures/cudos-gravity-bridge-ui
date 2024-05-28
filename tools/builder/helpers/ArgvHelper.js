class ArgvHelper {
  static parse() {
    for (let value, split, i = 2; i < process.argv.length; ++i) {
      value = process.argv[i];
      if (value.indexOf("-target") === 0) {
        split = value.split("=");
        if (split.length === 2) {
          ArgvHelper.TARGET = split[1].trim();
        }

        continue;
      }
      if (value.indexOf("-watch") === 0) {
        split = value.split("=");
        if (split.length === 2) {
          ArgvHelper.WATCH = split[1] === "1";
        }
        continue;
      }
      if (value.indexOf("-entry-point") === 0) {
        split = value.split("=");
        if (split.length === 2) {
          ArgvHelper.ENTRY_POINTS = split[1].trim().split("_");
        }

        continue;
      }
      if (value.indexOf("-start-server") === 0) {
        split = value.split("=");
        if (split.length === 2) {
          ArgvHelper.START_SERVER = split[1] === "1";
        }
        continue;
      }
      if (value.indexOf("-webpack") === 0) {
        split = value.split("=");
        if (split.length === 2) {
          ArgvHelper.WEBPACK = split[1] === "1";
        }
        continue;
      }
      if (value.indexOf("-server") === 0) {
        split = value.split("=");
        if (split.length === 2) {
          ArgvHelper.SERVER = split[1] === "1";
        }
        continue;
      }

      if (value.indexOf("-db-folder-clean") === 0) {
        split = value.split("=");
        if (split.length === 2) {
          ArgvHelper.DB_FOLDER_CLEAN = split[1] === "1";
        }
        continue;
      }

      if (value.indexOf("-server-debug") === 0) {
        split = value.split("=");
        if (split.length === 2) {
          ArgvHelper.SERVER_DEBUG = split[1] === "1";
        }
        continue;
      }
    }

    switch (ArgvHelper.TARGET) {
      default:
      case "dev":
        ArgvHelper.DEV = true;
        ArgvHelper.PROD = false;
        if (ArgvHelper.MINIFY === null) {
          ArgvHelper.MINIFY = false;
        }
        if (ArgvHelper.WATCH === null) {
          ArgvHelper.WATCH = true;
        }
        if (ArgvHelper.START_SERVER === null) {
          ArgvHelper.START_SERVER = true;
        }
        break;
      case "prod":
        ArgvHelper.DEV = false;
        ArgvHelper.PROD = true;
        if (ArgvHelper.MINIFY === null) {
          ArgvHelper.MINIFY = true;
        }
        if (ArgvHelper.WATCH === null) {
          ArgvHelper.WATCH = false;
        }
        if (ArgvHelper.START_SERVER === null) {
          ArgvHelper.START_SERVER = false;
        }
        break;
    }

    if (ArgvHelper.WEBPACK === null) {
      ArgvHelper.WEBPACK = true;
    }
    if (ArgvHelper.SERVER === null) {
      ArgvHelper.SERVER = true;
    }
  }

  static isEntryPoint(name) {
    if (ArgvHelper.ENTRY_POINTS === null) {
      return true;
    }

    for (let i = ArgvHelper.ENTRY_POINTS.length; i-- > 0; ) {
      if (ArgvHelper.ENTRY_POINTS[i] === name) {
        return true;
      }
    }

    return false;
  }
}

ArgvHelper.DEV = null;
ArgvHelper.PROD = null;
ArgvHelper.MINIFY = null;

ArgvHelper.ENTRY_POINTS = null;
ArgvHelper.WATCH = null;
ArgvHelper.START_SERVER = null;
ArgvHelper.WEBPACK = null;
ArgvHelper.SERVER = null;
ArgvHelper.DB_FOLDER_CLEAN = false;
ArgvHelper.SERVER_DEBUG = false;

ArgvHelper.parse();

module.exports = ArgvHelper;

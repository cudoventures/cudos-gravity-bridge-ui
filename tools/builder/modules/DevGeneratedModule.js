const fs = require("fs");
const path = require("path");

const Config = require("./../../../config/config");

const FileHelper = require("../helpers/FileHelper");

class DevGeneratedModule {
  static process(targetPathObj) {
    FileHelper.initDevGenerated();

    DevGeneratedModule.processPages(targetPathObj);
    DevGeneratedModule.processApis(targetPathObj);
    DevGeneratedModule.processNetwork(targetPathObj);
    DevGeneratedModule.processNetworkResponse(targetPathObj);
    DevGeneratedModule.processParams(targetPathObj);
    DevGeneratedModule.processConfig();
    DevGeneratedModule.processModules(targetPathObj);
    DevGeneratedModule.processCountries(targetPathObj);
  }

  static processPages(targetPathObj) {
    const sourcePath = targetPathObj.Backend.PAGES;

    const versions = fs.readdirSync(sourcePath);
    for (let i = versions.length; i-- > 0; ) {
      const targetPath = path.join(sourcePath, versions[i]);
      if (fs.statSync(targetPath).isDirectory() === false) {
        continue;
      }

      const info = infoByVersionName(versions[i]);
      if (info === null) {
        console.error(`Version ${versions[i]} is not defined`);
        continue;
      }

      const frontendPages = {};

      FileHelper.traversePath(targetPath, "", null, false, sourceChildPath => {
        if (sourceChildPath.indexOf(".h.") === -1) {
          return;
        }

        const obj =
          DevGeneratedModule.requireFileWithoutTransform(sourceChildPath);
        const name = obj.name
          .replace(/([A-Z])/g, "_$1")
          .toUpperCase()
          .substr(1)
          .replace("PAGE_", "")
          .replace("_H", "");
        frontendPages[name] = obj.URL;
      });

      fs.writeFileSync(
        path.join(Config.Path.Builds.DEV_GENERATED, info.fileName),
        `const ${info.objName} = ${JSON.stringify(frontendPages)}; export default ${info.objName};`
      );
    }
  }

  static processApis(targetPathObj) {
    const sourcePath = targetPathObj.Backend.API;

    const frontendApis = {};
    const frontendActions = {};

    FileHelper.traversePath(sourcePath, "", null, false, sourceChildPath => {
      if (sourceChildPath.indexOf(".h.js") === -1) {
        return;
      }

      const obj =
        DevGeneratedModule.requireFileWithoutTransform(sourceChildPath);
      if (obj.URL === undefined) {
        return;
      }

      const name = obj.name
        .replace(/([A-Z])/g, "_$1")
        .toUpperCase()
        .substr(1)
        .replace("_API_H", "");
      if (obj.Actions !== undefined) {
        frontendActions[name] = obj.Actions;
      }

      frontendApis[name] = obj.URL;
    });

    fs.writeFileSync(
      path.join(Config.Path.Builds.DEV_GENERATED, "/Apis.ts"),
      `const Apis = ${JSON.stringify(frontendApis)}; export default Apis;`
    );
    fs.writeFileSync(
      path.join(Config.Path.Builds.DEV_GENERATED, "/Actions.ts"),
      `const Actions = ${JSON.stringify(frontendActions)}; export default Actions;`
    );
  }

  static processNetwork(targetPathObj) {
    const sourcePath = path.join(targetPathObj.BACKEND, "requests", "network");
    FileHelper.traversePath(
      sourcePath,
      path.join(Config.Path.Builds.DEV_GENERATED, "requests", "network"),
      null,
      false,
      (sourceChildPath, targetChildPath) => {
        const model =
          DevGeneratedModule.requireFileWithoutTransform(sourceChildPath);
        const frontendObj = {};

        let hasConsts = false;

        Object.keys(model).forEach(key => {
          if (key.indexOf("S_") === 0) {
            hasConsts = true;
            frontendObj[key] = model[key];
          }
        });

        targetChildPath = targetChildPath
          .replace(".ts", "")
          .replace(".js", "")
          .replace("Model", "");
        targetChildPath = `${targetChildPath}Consts.ts`;

        if (hasConsts === true) {
          const className = model.name.replace("Model", "Consts");
          const dirPath = path.dirname(targetChildPath);
          if (fs.existsSync(dirPath) === false) {
            fs.mkdirSync(dirPath, { recursive: true });
          }
          fs.writeFileSync(
            targetChildPath,
            `const ${className} = ${JSON.stringify(frontendObj)}; export default ${className};`
          );
        } else if (fs.existsSync(targetChildPath)) {
          fs.unlinkSync(targetChildPath);
        }
      }
    );
  }

  static processNetworkResponse(targetPathObj) {
    const sourcePath = path.join(targetPathObj.BACKEND, "utilities", "network");
    FileHelper.traversePath(
      sourcePath,
      path.join(Config.Path.Builds.DEV_GENERATED, "utilities", "network"),
      null,
      false,
      (sourceChildPath, targetChildPath) => {
        const model =
          DevGeneratedModule.requireFileWithoutTransform(sourceChildPath);
        const frontendObj = {};

        let hasConsts = false;

        Object.keys(model).forEach(key => {
          if (key.indexOf("S_") === 0) {
            hasConsts = true;
            frontendObj[key] = model[key];
          }
        });

        targetChildPath = targetChildPath
          .replace(".ts", "")
          .replace(".js", "")
          .replace("Model", "");
        targetChildPath = `${targetChildPath}Consts.ts`;

        if (hasConsts === true) {
          const className = model.name.replace("Model", "Consts");
          const dirPath = path.dirname(targetChildPath);
          if (fs.existsSync(dirPath) === false) {
            fs.mkdirSync(dirPath, { recursive: true });
          }
          fs.writeFileSync(
            targetChildPath,
            `const ${className} = ${JSON.stringify(frontendObj)}; export default ${className};`
          );
        } else if (fs.existsSync(targetChildPath)) {
          fs.unlinkSync(targetChildPath);
        }
      }
    );
  }

  static processParams(targetPathObj) {
    const filePath = path.join(targetPathObj.Backend.UTILITIES, "Params.js");
    const params = DevGeneratedModule.requireFileWithoutTransform(filePath);
    fs.writeFileSync(
      path.join(Config.Path.Builds.DEV_GENERATED, "/Params.ts"),
      `const Params = ${JSON.stringify(params)}; export default Params;`
    );
  }

  static processConfig() {
    const config = {
      URL: Config.URL,
      APIS: Config.APIS,
      CUDOS_NETWORK: Config.CUDOS_NETWORK,
      ORCHESTRATOR: Config.ORCHESTRATOR,
      ETHEREUM: Config.ETHEREUM,
    };

    fs.writeFileSync(
      path.join(Config.Path.Builds.DEV_GENERATED, "Config.ts"),
      `const Config = ${JSON.stringify(config)}; export default Config;`
    );
  }

  static processModules(targetPathObj) {
    FileHelper.traversePath(
      targetPathObj.Backend.MODULES,
      Config.Path.Builds.DEV_GENERATED,
      null,
      false,
      (sourceChildPath, targetChildPath) => {
        const model =
          DevGeneratedModule.requireFileWithoutTransform(sourceChildPath);
        const frontendObj = {};

        let hasConsts = false;

        Object.keys(model).forEach(key => {
          if (key.indexOf("S_") === 0) {
            hasConsts = true;
            frontendObj[key] = model[key];
          }
        });

        targetChildPath = targetChildPath
          .replace(".h", "")
          .replace(".ts", "")
          .replace(".js", "")
          .replace("Model", "");
        targetChildPath = `${targetChildPath}Consts.ts`;

        if (hasConsts === true) {
          const className = model.name.replace("Model", "Consts");
          const dirPath = path.dirname(targetChildPath);
          if (fs.existsSync(dirPath) === false) {
            fs.mkdirSync(dirPath, { recursive: true });
          }
          fs.writeFileSync(
            targetChildPath,
            `const ${className} = ${JSON.stringify(frontendObj)}; export default ${className};`
          );
        } else if (fs.existsSync(targetChildPath)) {
          fs.unlinkSync(targetChildPath);
        }
      }
    );
  }

  static processCountries(targetPathObj) {
    let countriesFileContent = fs
      .readFileSync(path.join(targetPathObj.Backend.UTILITIES, "Countries.js"))
      .toString();
    countriesFileContent = countriesFileContent.substr(
      0,
      countriesFileContent.lastIndexOf("module.exports")
    );

    fs.writeFileSync(
      path.join(Config.Path.Builds.DEV_GENERATED, "Countries.ts"),
      `${countriesFileContent} export default countries;\nexport { map as CountriesMap };`
    );
  }

  static matchAndProcess(targetPath, targetPathObj) {
    if (targetPath.indexOf(Config.Path.Root.Backend.PAGES) === 0) {
      DevGeneratedModule.processPages(targetPathObj);
      return true;
    }
    if (targetPath.indexOf(Config.Path.Root.Backend.API) === 0) {
      DevGeneratedModule.processApis(targetPathObj);
      return true;
    }
    if (
      targetPath.indexOf(
        path.join(Config.Path.Root.BACKEND, "/requests/network-request")
      ) === 0
    ) {
      DevGeneratedModule.processNetwork(targetPathObj);
      return true;
    }
    if (
      targetPath.indexOf(
        path.join(Config.Path.Root.BACKEND, "/requests/network-response")
      ) === 0
    ) {
      DevGeneratedModule.processNetwork(targetPathObj);
      return true;
    }
    if (targetPath.indexOf(Config.Path.Root.Backend.UTILITIES) === 0) {
      DevGeneratedModule.processParams(targetPathObj);
      DevGeneratedModule.processCountries(targetPathObj);
      return true;
    }
    if (targetPath.indexOf(Config.Path.Root.Backend.MODULES) === 0) {
      DevGeneratedModule.processModules(targetPathObj);
    }
    return false;
  }

  static requireFileWithoutTransform(filePath) {
    filePath = filePath.replace(".ts", ".js");
    delete require.cache[require.resolve(filePath)];

    const module = require(filePath);
    return module.default !== undefined ? module.default : module;
  }
}

module.exports = DevGeneratedModule;

function infoByVersionName(versionFolderName) {
  const sentenceCase = `${versionFolderName[0].toUpperCase()}${versionFolderName.substring(1)}`;
  switch (versionFolderName) {
    case "general":
      return { objName: "PagesGeneral", fileName: "PagesGeneral.ts" };
    case "cpanel":
      return { objName: "PagesCPanel", fileName: "PagesCPanel.ts" };
    case "cadmin":
      return { objName: "PagesCAdmin", fileName: "PagesCAdmin.ts" };
    case "platform":
      return { objName: "PagesPlatform", fileName: "PagesPlatform.ts" };
    default:
      return { objName: sentenceCase, fileName: `Pages${sentenceCase}.ts` };
  }
}

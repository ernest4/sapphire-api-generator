"use strict";

const fs = require("fs");
const { exec } = require("child_process");
const capitalize = require("../utils/capitalize");

// directory generators
const directoryCreator = require("../dirCreators/dirCreators");

// file template generators
const { inlineSource, jsonBackedSchemaSource } = require("./fileTemplates/js/allModels.source");
const { allRoutesSource } = require("./fileTemplates/js/allRoutes.source");
const { authMiddlewareSource } = require("./fileTemplates/js/authMiddleware.source");
const { controllerSource } = require("./fileTemplates/js/controller.source");
const { corsSource } = require("./fileTemplates/js/cors.source");
const { introSources } = require("./fileTemplates/js/intros.source");
const { loggingSource } = require("./fileTemplates/js/logging.source");
const { modelInlineSource, modelJavaScriptSource } = require("./fileTemplates/js/model.source");
const { readmeSource } = require("./fileTemplates/js/readme.source");
const { routesSource } = require("./fileTemplates/js/routes.source");
const { schemaLoaderUtilSource } = require("./fileTemplates/js/schemaLoaderUtil.source");
const { serverSource } = require("./fileTemplates/js/server.source");
const { serviceSource } = require("./fileTemplates/js/service.source");
const { editableTestSource, generatedTestSource } = require("./fileTemplates/js/test.source");
const {
  developmentSource,
  indexSource,
  productionSource,
  testSource
} = require("./fileTemplates/js/config.source");
const { testUtilsSource } = require("./fileTemplates/js/testUtils.source");

// pre json object generators
const { sapphireJSONObject } = require("./fileTemplates/object/sapphire.object");
const { packageJSONObject } = require("./fileTemplates/object/package.object");

function createJSONFileSync(
  app_name,
  options,
  sapphireVersion,
  createObject,
  updateObject,
  jsonPath
) {
  try {
    const indent = 2;
    let jsonSource = "";

    if (updateObject) jsonSource = JSON.stringify(updateObject, null, indent);
    else jsonSource = JSON.stringify(createObject, null, indent);

    fs.writeFileSync(jsonPath, jsonSource);

    return `  created: ${jsonPath}`;
  } catch (err) {
    throw new Error(err);
  }
}

function createSapphireFileSync(app_name, options, sapphireVersion) {
  const objectPath = `${app_name}/sapphire.json`;
  const createObject = sapphireJSONObject(...arguments);
  return createJSONFileSync(...arguments, createObject, null, objectPath);
}

function createPackageJSONFileSync(app_name, options, sapphireVersion) {
  const objectPath = `${app_name}/package.json`;
  const createObject = packageJSONObject(...arguments);
  return createJSONFileSync(...arguments, createObject, null, objectPath);
}

function createFileSync(path, source) {
  try {
    fs.writeFileSync(path, source);
    return `  created: ${path}`;
  } catch (err) {
    throw err; // rethrow
  }
}

function createCorsFileSync(app_name, options) {
  const path = `${app_name}/api/shared/cors.js`;
  const source = corsSource(options);
  return createFileSync(path, source);
}

function createEnvFileSync(app_name) {
  const path = `${app_name}/.env`;
  // TODO: implement logic to determine what goes into .env for eg if auth is used, then put auth
  // vars in here...
  const source = `DEVELOPMENT_DB="${app_name}"`;
  return createFileSync(path, source);
}

function appendEnvFile(content) {
  try {
    const envPath = `./.env`;
    fs.appendFileSync(envPath, content);
    return `             modified: ${envPath}
    `;
  } catch (err) {
    throw new Error(err);
  }
}

function createServerFileSync(app_name, options) {
  const path = `${app_name}/server.js`;
  const source = serverSource(app_name, options);
  return createFileSync(path, source);
}

function createHerokuFileSync(app_name, options) {
  if (!options.heroku) return;
  const path = `${app_name}/Procfile`;
  const source = "web: node server.js";
  return createFileSync(path, source);
}

function createGitFilesSync(app_name, options) {
  if (!options.git) return;
  exec(`git init ./${app_name}`, (err, stdout, stderr) => {
    // node couldn't execute the command
    if (err) return;

    const path = `${app_name}/.gitignore`;
    const source = `.env
tests/integration/temp.json`;

    console.log(`       NOTE: ${stdout}`);
    return createFileSync(path, source);
  });
}

function createReadMeFileSync(app_name, options) {
  if (!options.readme) return;
  const path = `${app_name}/README.md`;
  const source = readmeSource();
  return createFileSync(path, source);
}

function createIntroTXTFilesSync(app_name, options) {
  if (!options.intro) return;
  const introFileName = `README.txt`;
  const introSourcesArray = introSources(app_name, introFileName);

  let status = `
       creating introduction files:
  `;

  for (const introSource of introSourcesArray) {
    const { path, source } = introSource;
    status += `
       ${createFileSync(path, source)}`;
  }
  return status;
}

function createMiddlewareFilesSync(app_name, options) {
  // TODO: smartly populate...
  const middlewares = ["logging"];

  const middlewareSources = {};
  middlewareSources["logging"] = loggingSource();

  let status = `
       creating shared files:
         `;

  for (const option in options) {
    if (middlewares.some(middleware => middleware === option)) {
      let path = `${app_name}/api/shared/middleware/${option}.js`;
      status += `
       ${createFileSync(path, middlewareSources[option])}`;
    }
  }
  return status;
}

function createSchemaLoaderUtilFile(app_name, options) {
  if (options.inline) return;
  const path = `${app_name}/_utils/mongooseJSONSchemaLoader.js`;
  const source = schemaLoaderUtilSource();
  return createFileSync(path, source);
}

function createControllerFileSync(asset, options) {
  if (options.model) return;
  const path = `./api/v${options.apiv}/controllers/${asset}.controller.js`;
  const source = controllerSource(asset, options);
  return createFileSync(path, source);
}

function createAllModelsFile(inline, apiVersion) {
  const path = `./api/v${apiVersion}/models/all.models.js`;
  const source = inline ? inlineSource(apiVersion) : jsonBackedSchemaSource(apiVersion);
  return createFileSync(path, source);
}

function createModelFileSync(asset, options) {
  try {
    const sapphireJSON = fs.readFileSync(`./sapphire.json`);
    const inline = JSON.parse(sapphireJSON).inline;

    createAllModelsFile(inline, options.apiv);

    let returnStr = ``;

    if (inline) {
      const modelInlineSourcePath = `./api/v${options.apiv}/models/${asset}.model.js`;
      fs.writeFileSync(modelInlineSourcePath, modelInlineSource(asset));
      returnStr += `created: ${modelInlineSourcePath}`;
    } else {
      const indent = 2;
      const modelSchemaJSONSource = JSON.stringify(
        {
          createdDate: {
            type: "Date",
            default: "Date.now"
          },
          auth: {
            type: "Boolean",
            default: !!options.auth
          }
        },
        null,
        indent
      );

      const modelDirPath = `./api/v${options.apiv}/models/${asset}`;
      returnStr += `
           ${directoryCreator.createDir(modelDirPath)}`;

      const modelJavaScriptSourcePath = `${modelDirPath}/${asset}.model.js`;
      fs.writeFileSync(modelJavaScriptSourcePath, modelJavaScriptSource(asset, options));
      returnStr += `
             created: ${modelJavaScriptSourcePath}`;

      const modelSchemaJSONSourcePath = `${modelDirPath}/${asset}.schema.json`;
      fs.writeFileSync(modelSchemaJSONSourcePath, modelSchemaJSONSource);
      returnStr += `
             created: ${modelSchemaJSONSourcePath}
          `;
    }

    return returnStr;
  } catch (err) {
    err = pathCheck(err);
    throw new Error(err);
  }
}

function createAuthMiddleware() {
  const path = `./api/shared/middleware/auth.js`;
  const source = authMiddlewareSource();
  return `           ${createFileSync(path, source)}`;
}

function createAllRoutesFile(apiVersion) {
  const path = `./api/v${apiVersion}/routes/all.routes.js`;
  const source = allRoutesSource(apiVersion);
  return `     ${createFileSync(path, source)}`;
}

function createRoutesFileSync(asset, options) {
  if (options.model) return;
  if (options.auth) {
    try {
      const sapphireJSONPath = `./sapphire.json`;
      const sapphireJSON = fs.readFileSync(sapphireJSONPath);
      const sapphireObject = JSON.parse(sapphireJSON);

      if (!sapphireObject.auth) {
        console.log(createAuthMiddleware());
        console.log(
          appendEnvFile(`
AUTH0_DOMAIN="your_auth0_domain_here"
AUTH0_AUDIENCE="your_auth0_audience_here"
AUTH0_CLIENT_ID="your_auth0_machine_to_machine_client_id_here"
AUTH0_CLIENT_SECRET="your_auth0_machine_to_machine_client_secret_here"
`)
        );

        sapphireObject.auth = true;

        fs.writeFileSync(sapphireJSONPath, JSON.stringify(sapphireObject, null, 2));
      }
    } catch (err) {
      throw new Error(err);
    }
  }

  console.log(createAllRoutesFile(options.apiv));

  try {
    const routesPath = `./api/v${options.apiv}/routes/${asset}.routes.js`;

    fs.writeFileSync(routesPath, routesSource(asset, options));

    return `created: ${routesPath}`;
  } catch (err) {
    err = pathCheck(err);
    throw new Error(err);
  }
}

function createServiceFileSync(asset, options) {
  if (options.model) return;
  const path = `./api/v${options.apiv}/services/${asset}.service.js`;
  const source = serviceSource(asset);
  return `
     ${createFileSync(path, source)}`;
}

function createEditableTestFileSync(asset, options) {
  if (options.model) return;
  const path = `./tests/integration/v${options.apiv}/custom/${asset}Custom.test.js`;
  const source = editableTestSource(asset, options);
  return `
     ${createFileSync(path, source)}`;
}

function createGeneratedTestFileSync(asset, options, model) {
  if (options.model) return;
  const path = `./tests/integration/v${options.apiv}/generated/${asset}.test.js`;
  const source = generatedTestSource(asset, options, model);
  return `
     ${createFileSync(path, source)}`;
}

function createDevelopmentFileSync(app_name, options, sapphireVersion) {
  const path = `${app_name}/config/development.js`;
  const source = developmentSource();
  return `
     ${createFileSync(path, source)}`;
}

function createIndexFileSync(app_name, options, sapphireVersion) {
  const path = `${app_name}/config/index.js`;
  const source = indexSource();
  return `
     ${createFileSync(path, source)}`;
}

function createProductionFileSync(app_name, options, sapphireVersion) {
  const path = `${app_name}/config/production.js`;
  const source = productionSource();
  return `
     ${createFileSync(path, source)}`;
}

function createTestFileSync(app_name, options, sapphireVersion) {
  const path = `${app_name}/config/test.js`;
  const source = testSource();
  return `
     ${createFileSync(path, source)}`;
}

function createTestUtilsFileSync(app_name, options, sapphireVersion) {
  const path = `${app_name}/tests/integration/utils.js`;
  const source = testUtilsSource();
  return `
     ${createFileSync(path, source)}`;
}

function pathCheck(err) {
  if (err.message.match(/no such file or directory, open/))
    err.message += `
       Are you inside a Sapphire project directory?`;

  return err;
}

let initArray = [];
initArray.push(createEnvFileSync);
initArray.push(createServerFileSync);
initArray.push(createHerokuFileSync);
initArray.push(createReadMeFileSync);
initArray.push(createSapphireFileSync);
initArray.push(createPackageJSONFileSync);
initArray.push(createSchemaLoaderUtilFile);
// batch create middleware files
initArray.push(createMiddlewareFilesSync);
initArray.push(createCorsFileSync);
initArray.push(createDevelopmentFileSync);
initArray.push(createIndexFileSync);
initArray.push(createProductionFileSync);
initArray.push(createTestFileSync);
initArray.push(createTestUtilsFileSync);
initArray.push(createGitFilesSync);
// batch create intro files
initArray.push(createIntroTXTFilesSync);

let generateArray = [];
generateArray.push(createControllerFileSync);
generateArray.push(createModelFileSync);
generateArray.push(createRoutesFileSync);
generateArray.push(createServiceFileSync);
generateArray.push(createEditableTestFileSync);
generateArray.push(createGeneratedTestFileSync);

// let updateArray = []; // wip. for update command...
// generateArray.push(createModelFileSync);
// generateArray.push(createGeneratedTestFileSync);

module.exports = {
  initFileCreators: initArray,
  generateFileCreators: generateArray,
  // updateFileCreators: updateArray
  createGeneratedTestFileSync: createGeneratedTestFileSync
};

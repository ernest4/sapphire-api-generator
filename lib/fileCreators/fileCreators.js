"use strict";

const fs = require("fs");
const capitalize = require("../utils/capitalize");

// directory generators
const directoryCreator = require("../dirCreators/dirCreators");

// file template generators
const allModelsSource = require("./fileTemplates/allModels.source");
const { allRoutesSource } = require("./fileTemplates/allRoutes.source");
const { authMiddlewareSource } = require("./fileTemplates/authMiddleware.source");
const { controllerSource } = require("./fileTemplates/controller.source");
const { corsSource } = require("./fileTemplates/cors.source");
const { introSources } = require("./fileTemplates/intros.source");
const loggingSource = require("./fileTemplates/logging.source");
const modelSource = require("./fileTemplates/model.source");
const { readmeSource } = require("./fileTemplates/readme.source");
const { routesSource } = require("./fileTemplates/routes.source");
const { schemaLoaderUtilSource } = require("./fileTemplates/schemaLoaderUtil.source");
const serverSource = require("./fileTemplates/server.source");
const serviceSource = require("./fileTemplates/service.source");

function createSapphireFileSync(app_name, options, sapphireVersion, updateObject) {
  const indent = 2;
  try {
    let sapphireSource = "";

    if (updateObject) {
      sapphireSource = JSON.stringify(updateObject, null, indent);
    } else {
      sapphireSource = JSON.stringify(
        {
          sapphireVersion,
          appName: app_name,
          inline: !!options.inline,
          apiVersions: [options.apiv]
        },
        null,
        indent
      );
    }

    const sapphirePath = `${app_name}/sapphire.json`;
    fs.writeFileSync(sapphirePath, sapphireSource);
    return `  created: ${sapphirePath}`;
  } catch (err) {
    throw new Error(err);
  }
}

function createCorsFileSync(app_name, options) {
  const indent = 2;
  try {
    const corsPath = `${app_name}/api/shared/cors.js`;
    fs.writeFileSync(corsPath, corsSource(options));
    return `  created: ${corsPath}`;
  } catch (err) {
    throw new Error(err);
  }
}

function createPackageJSONFileSync(app_name, options, sapphireVersion) {
  const indent = 2;
  try {
    const packageJSONSource = JSON.stringify(
      {
        name: app_name,
        version: "0.1.0",
        description: `back end api for the ${app_name} app generate with Sapphire v${sapphireVersion}`,
        main: "server.js",
        scripts: {
          test: 'echo "Error: no test specified" && exit 1',
          start: "node server.js",
          nodemon: "nodemon server.js"
        },
        // author: "your name here", // add in future?
        // license: "UNLICENSED", // add in future?
        dependencies: {
          "body-parser": "^1.18.3",
          cors: "^2.8.5",
          dotenv: "^7.0.0",
          express: "^4.16.4",
          "express-jwt": "^5.3.1",
          "jwks-rsa": "^1.4.0",
          mongoose: "^5.4.20"
        },
        devDependencies: {
          nodemon: "^1.18.10"
        }
      },
      null,
      indent
    );

    const packageJSONPath = `${app_name}/package.json`;
    fs.writeFileSync(packageJSONPath, packageJSONSource);
    return `  created: ${packageJSONPath}`;
  } catch (err) {
    throw new Error(err);
  }
}

function createEnvFileSync(app_name) {
  try {
    // TODO: implement logic to determine what goes into .env for eg if auth is used, then put auth
    // vars in here...
    const envSource = `DEVELOPMENT_DB="${app_name}"`;

    const envPath = `${app_name}/.env`;
    fs.writeFileSync(envPath, envSource);
    return `  created: ${envPath}`;
  } catch (err) {
    throw new Error(err);
  }
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
  try {
    // TODO: load the real source...
    const serverSource = `const os = require("os");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotEnv = require("dotenv");
const allModels = require("./api/v1/models/all.models");
const allRoutes = require("./api/v1/routes/all.routes");
const customCors = require("./api/shared/cors");
${options.logging ? 'const logging = require("./api/shared/middleware/logging");' : ""}

// make variables available from .env locally
dotEnv.config();

// config constants
const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI || \`mongodb://localhost/\${process.env.DEVELOPMENT_DB}\`;

// initialize the app
const app = express();

// connect mongoose
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true
});

// connect middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(customCors);
${options.logging ? "app.use(logging.logRequest);" : ""}

// register routes
allRoutes(app);

${
  options.ping
    ? `// server status ping
app.get("/ping", (req, res) => {
  res.json({
    pong: {
      server_time: new Date(),
      os_info: {
        platform: os.platform(),
        release: os.release(),
        arch: os.arch(),
        cpus: Object.values(os.cpus()).map(cpu => ({ model: cpu.model, speed: cpu.speed })),
        endiannes: os.endianness(),
        free_memory: { free_memory: os.freemem() / 1024 / 1024, unit: "MB" },
        totalmem: { totalmem: os.totalmem() / 1024 / 1024, unit: "MB" },
        uptime: { uptime: os.uptime(), unit: "s" }
      }
    }
  });
});
`
    : ""
}
// catch all for unknown routes
app.use((req, res) => {
  res
    .status(404)
    .json({ url: req.originalUrl, message: \`\${req.originalUrl} not found on this server!\` });
});

app.listen(PORT);

console.log(\`${app_name} API server started on: \${PORT}\`);
`;

    fs.writeFileSync(`${app_name}/server.js`, serverSource);
    return `  created: ${app_name}/server.js`;
  } catch (err) {
    throw new Error(err);
  }
}

function createHerokuFileSync(app_name, options) {
  try {
    const procfileSource = "web: node server.js";

    if (options.heroku) {
      const procfilePath = `${app_name}/Procfile`;
      fs.writeFileSync(procfilePath, procfileSource);
      return `  created: ${procfilePath}`;
    }
  } catch (err) {
    throw new Error(err);
  }
}

function createGitFilesSync(app_name, options) {
  try {
    // TODO: need to make .git and initialize repo...
    const gitignoreSource = ".env";

    if (options.git) {
      const gitignorePath = `${app_name}/.gitignore`;
      fs.writeFileSync(gitignorePath, gitignoreSource);
      return `  created: ${gitignorePath}`;
    }
  } catch (err) {
    throw new Error(err);
  }
}

function createReadMeFileSync(app_name, options) {
  try {
    if (options.readme) {
      const readmePath = `${app_name}/README.md`;
      fs.writeFileSync(readmePath, readmeSource());
      return `  created: ${readmePath}`;
    }
  } catch (err) {
    throw new Error(err);
  }
}

function createIntroTXTFilesSync(app_name, options) {
  try {
    if (options.intro) {
      const introFileName = `README.txt`;
      const introSourcesArray = introSources(app_name, introFileName);

      let status = `
       creating introduction files:
       `;

      for (const introSource of introSourcesArray) {
        fs.writeFileSync(introSource.path, introSource.source);
        status += `
         created: ${introSource.path}`;
      }
      return status;
    }
  } catch (err) {
    throw new Error(err);
  }
}

function createMiddlewareFilesSync(app_name, options) {
  try {
    // TODO: smartly populate...

    const middlewares = ["logging"];

    const middlewareSources = {};
    middlewareSources["logging"] = `WIP logging intro...`;

    let status = `
       creating shared files:
       `;

    for (const option in options) {
      if (middlewares.some(middleware => middleware === option)) {
        let path = `${app_name}/api/shared/middleware/${option}.js`;

        fs.writeFileSync(path, middlewareSources[option]);

        status += `
         created: ${path}`;
      }
    }

    return status;
  } catch (err) {
    throw new Error(err);
  }
}

function createSchemaLoaderUtilFile(app_name, options) {
  try {
    if (!options.inline) {
      const schemaLoaderPath = `${app_name}/_utils/mongooseJSONSchemaLoader.js`;
      fs.writeFileSync(schemaLoaderPath, schemaLoaderUtilSource());
      return `  created: ${schemaLoaderPath}`;
    }
  } catch (err) {
    throw new Error(err);
  }
}

function createControllerFileSync(asset, options) {
  if (options.model) return;
  try {
    const controllerPath = `./api/v${options.apiv}/controllers/${asset}.controller.js`;

    fs.writeFileSync(controllerPath, controllerSource(asset));

    return `created: ${controllerPath}`;
  } catch (err) {
    err = pathCheck(err);
    throw new Error(err);
  }
}

function createAllModelsFile(inline, apiVersion) {
  try {
    const { inlineSource, jsonBackedSchemaSource } = allModelsSource;
    const allModelsPath = `./api/v${apiVersion}/models/all.models.js`;

    if (inline) fs.writeFileSync(allModelsPath, inlineSource(apiVersion));
    else fs.writeFileSync(allModelsPath, jsonBackedSchemaSource(apiVersion));
    return `       created: ${allModelsPath}`;
  } catch (err) {
    throw new Error(err);
  }
}

function createModelFileSync(asset, options) {
  try {
    const { modelInlineSource, modelJavaScriptSource } = modelSource;
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
  try {
    fs.writeFileSync(path, authMiddlewareSource());
    return `             created: ${path}`;
  } catch (err) {
    throw new Error(err);
  }
}

function createAllRoutesFile(apiVersion) {
  try {
    const allRoutesPath = `./api/v${apiVersion}/routes/all.routes.js`;
    fs.writeFileSync(allRoutesPath, allRoutesSource(apiVersion));
    return `       created: ${allRoutesPath}`;
  } catch (err) {
    throw new Error(err);
  }
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
AUTH0_AUDIENCE="your_auth0_audience_here"`)
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
  try {
    // TODO: smart populate ...
    const serviceSource = `"use strict";
const mongoose = require("mongoose");

const ${capitalize(asset)} = mongoose.model("${capitalize(asset)}");

exports.index${capitalize(asset)} = async () => {
  try {
    const ${asset} = await ${capitalize(asset)}.find({});
    return ${asset};
  } catch (err) {
    throw new Error(err);
  }
};

exports.create${capitalize(asset)} = async ${asset} => {
  try {
    // await ${capitalize(asset)}.once('index'); // TESTING...
    const new${capitalize(asset)} = new ${capitalize(asset)}(${asset});
    const saved${capitalize(asset)} = await new${capitalize(asset)}.save();
    return saved${capitalize(asset)};
  } catch (err) {
    throw new Error(err);
  }
};

exports.show${capitalize(asset)} = async ${asset}Id => {
  try {
    const ${asset} = await ${capitalize(asset)}.findById(${asset}Id);
    return ${asset};
  } catch (err) {
    throw new Error(err);
  }
};

exports.update${capitalize(asset)} = async (${asset}Id, new${capitalize(asset)}Body) => {
  try {
    const updated${capitalize(asset)} = await ${capitalize(
      asset
    )}.findOneAndUpdate({ _id: ${asset}Id }, new${capitalize(asset)}Body, { new: true });
    return updated${capitalize(asset)};
  } catch (err) {
    throw new Error(err);
  }
};

exports.delete${capitalize(asset)} = async ${asset}Id => {
  try {
    await ${capitalize(asset)}.deleteOne({ _id: ${asset}Id });
    return { message: "${asset} successfully deleted" };
  } catch (err) {
    throw new Error(err);
  }
};    
`;

    const servicePath = `./api/v${options.apiv}/services/${asset}.service.js`;

    fs.writeFileSync(servicePath, serviceSource);

    return `created: ${servicePath}`;
  } catch (err) {
    err = pathCheck(err);
    throw new Error(err);
  }
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
initArray.push(createGitFilesSync);
initArray.push(createReadMeFileSync);
initArray.push(createSapphireFileSync);
initArray.push(createPackageJSONFileSync);
initArray.push(createSchemaLoaderUtilFile);
// batch create intro files
initArray.push(createIntroTXTFilesSync);
// batch create middleware files
initArray.push(createMiddlewareFilesSync);
initArray.push(createCorsFileSync);

let generateArray = [];
generateArray.push(createControllerFileSync);
generateArray.push(createModelFileSync);
generateArray.push(createRoutesFileSync);
generateArray.push(createServiceFileSync);

module.exports = {
  initFileCreators: initArray,
  generateFileCreators: generateArray
};

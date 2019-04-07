"use strict";

const fs = require("fs");

function createSapphireFileSync(app_name, options, sapphireVersion) {
  const indent = 2;
  try {
    const sapphireSource = JSON.stringify(
      {
        sapphireVersion,
        appName: app_name
      },
      null,
      indent
    );

    const sapphirePath = `${app_name}/sapphire.json`;
    fs.writeFileSync(sapphirePath, sapphireSource);
    return `  created: ${sapphirePath}`;
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
    const envSource = "WIP";

    const envPath = `${app_name}/.env`;
    fs.writeFileSync(envPath, envSource);
    return `  created: ${envPath}`;
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
    // TODO: smartly populate readme...
    const readmeSource = `# This project was generated with [Sapphire](https://github.com/ernest4/sapphire-api-generator)

Node.js [Express](https://www.npmjs.com/package/express) REST*like* SOA*like* API generator for SPAs.

Where Rails and Sails fails, Sapphire prevails!

Convention over configuration? Why choose?! Welcome to the configurable convention!

* If Rails is too constrictive but Express is too open ended then this is the framework for you.

* If you want to generate boilerplate so you can focus on development, but still have the full power to do anything at any time, this is the framework for you.

* If you’re a newbie, starting out and want to build web apps quickly I’d advise Rails. Solid MVC fundamentals will do you well. Once you come back note that you wont find 'fat' models here, but an SOA based architecture!

* If you know what MVC is and appreciate Rails, but want the speed and power of Node.js with the niceties of Rails, this is the framework for you.

**All feedback wellcome, I want this tool to be the best tool it can be!**

*RESTlike because you're free to do what you want with your routes.*

*SOAlike because SOA by definition are over the network, however the services in sapphire don't have to be over the network - because you're free to do what you want with your services.*
`;

    if (options.readme) {
      const readmePath = `${app_name}/README.md`;
      fs.writeFileSync(readmePath, readmeSource);
      return `  created: ${readmePath}`;
    }
  } catch (err) {
    throw new Error(err);
  }
}

function createIntroTXTFilesSync(app_name, options) {
  try {
    if (options.intro) {
      // TODO: smartly populate intro...

      const utilsIntroSource = `This folder is for utterly generic utility functions and classes which are not specific to web apps
in general. For e.g. a function milisToMinutes(miliseconds) which does time manipulation and has
nothing specific to do with Express or web apps in general, but may be used all over the app.
`;
      const sharedIntroSource = `Code that is broadly shared all throughout the web app shall go here. Even if the code is a once
off used in the app, if it doesn't really belong in services, models, controller etc. it shall go
here.
`;
      const controllerIntroSource = `Controllers extract the data from requests pass it services and return their responses to ${asset}s.
Controllers get called by the routes handler.

Controllers are 'thin' and minimal.
`;
      const modelsIntroSource = `Models encapsulate the database information such as schemas, validations, indexes etc.
All of the models are imported into all.models.js and exported as a single function in server.js

Models will be accessed by services.

Models are 'thin' and minimal.
`;
      const routesIntroSource = `Routes tie together the URLs and controllers and any acompanying middleware such as authorization.
All of the routes are imported into all.routes.js and exported as a single function to wrap around
the app object in server.js

Routes are 'thin' and minimal.
`;
      const servicesIntroSource = `Services is where all the business log lives. Services are 'fat' and contain everything they need
to do their jobs. Initialized by controllers, Services ultimately respond back to controllers.
`;

      const introFile = "_intro.txt";

      let introSources = [];
      introSources.push({
        path: `${app_name}/_utils/${introFile}`,
        source: utilsIntroSource
      });
      introSources.push({
        path: `${app_name}/api/shared/${introFile}`,
        source: sharedIntroSource
      });
      introSources.push({
        path: `${app_name}/api/v1/controllers/${introFile}`,
        source: controllerIntroSource
      });
      introSources.push({
        path: `${app_name}/api/v1/models/${introFile}`,
        source: modelsIntroSource
      });
      introSources.push({
        path: `${app_name}/api/v1/routes/${introFile}`,
        source: routesIntroSource
      });
      introSources.push({
        path: `${app_name}/api/v1/services/${introFile}`,
        source: servicesIntroSource
      });

      let status = `
       creating introduction files:
       `;
      for (const introSource of introSources) {
        // TODO: put correct source to correct path

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

    const middlewares = ["auth", "logging"];

    const middlewareSources = {};
    middlewareSources["auth"] = `WIP auth ...`;
    middlewareSources["logging"] = `WIP logging intro...`;

    let status = `
       creating middleware files:
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

function createControllerFileSync(asset, options) {
  if (options.model) return;
  try {
    // TODO: smart populate ...
    const controllerSource = `"use strict";

const ${asset}Service = require("../services/${asset}.service");

exports.index${capitalize(asset)}s = async (req, res, next) => {
  try {
    const response = await ${asset}Service.index${capitalize(asset)}s();
    res.json(response); // respond to user
  } catch (err) {
    next(err); // pass the error to error handling middleware
  }
};

exports.create${capitalize(asset)} = async (req, res, next) => {
  const { body } = req;
  try {
    const response = await ${asset}Service.create${capitalize(asset)}(body)
    res.json(response); // respond to user
  } catch (err) {
    next(err); // pass the error to error handling middleware
  }
};

exports.show${capitalize(asset)} = async (req, res, next) => {
  const { ${asset}Id } = req.params;
  try {
    const response = await ${asset}Service.show${capitalize(asset)}(${asset}Id);
    res.json(response); // respond to user
  } catch (err) {
    next(err); // pass the error to error handling middleware
  }
};

// TODO: investigate why this route isn't working properly
exports.update${capitalize(asset)} = async (req, res, next) => {
  const { ${asset}Id } = req.params;
  const { body } = req;
  try {
    const response = await ${asset}Service.update${capitalize(asset)}(${asset}Id, body);
    res.json(response); // respond to user
  } catch (err) {
    next(err); // pass the error to error handling middleware
  }
};

exports.delete${capitalize(asset)} = async (req, res, next) => {
  const { ${asset}Id } = req.params;
  try {
    const response = await ${asset}Service.delete${capitalize(asset)}(${asset}Id);
    res.json(response); // respond to user
  } catch (err) {
    next(err); // pass the error to error handling middleware
  }
};
`;

    const controllerPath = `./api/v${options.apiv}/controllers/${asset}.controller.js`;

    fs.writeFileSync(controllerPath, controllerSource);

    return `controller: ${controllerPath}`;
  } catch (err) {
    err = pathCheck(err);
    throw new Error(err);
  }
}

function createModelFileSync(asset, options) {
  try {
    // TODO: smart populate ...
    const modelSource = `"use strict";
// model ...
`;

    const modelPath = `./api/v${options.apiv}/models/${asset}.model.js`;

    fs.writeFileSync(modelPath, modelSource);

    return `model:      ${modelPath}`;
  } catch (err) {
    err = pathCheck(err);
    throw new Error(err);
  }
}

function createRoutesFileSync(asset, options) {
  if (options.model) return;
  try {
    // TODO: smart populate ...
    const routesSource = `"use strict";
// routes ...
`;

    const routesPath = `./api/v${options.apiv}/routes/${asset}.routes.js`;

    fs.writeFileSync(routesPath, routesSource);

    return `routes:     ${routesPath}`;
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
// service ...
`;

    const servicePath = `./api/v${options.apiv}/services/${asset}.service.js`;

    fs.writeFileSync(servicePath, serviceSource);

    return `service:    ${servicePath}`;
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

function capitalize(string){
  return string.charAt(0).toUpperCase() + string.slice(1);
}

let initArray = [];
initArray.push(createEnvFileSync);
initArray.push(createServerFileSync);
initArray.push(createHerokuFileSync);
initArray.push(createGitFilesSync);
initArray.push(createReadMeFileSync);
initArray.push(createSapphireFileSync);
initArray.push(createPackageJSONFileSync);
// batch create intro files
initArray.push(createIntroTXTFilesSync);
// batch create middleware files
initArray.push(createMiddlewareFilesSync);

let generateArray = [];
generateArray.push(createControllerFileSync);
generateArray.push(createModelFileSync);
generateArray.push(createRoutesFileSync);
generateArray.push(createServiceFileSync);

module.exports = {
  initFileCreators: initArray,
  generateFileCreators: generateArray
};

"use strict";

const fs = require("fs");

// directory generators
const directoryCreator = require("../dirCreators/dirCreators");

// file template generators
const allModelsSource = require("./fileTemplates/allModels.source");
const allRoutesSource = require("./fileTemplates/allRoutes.source");
const authMiddlewareSource = require("./fileTemplates/authMiddleware.source");
const controllerSource = require("./fileTemplates/controller.source");
const corsSource = require("./fileTemplates/cors.source");
const introsSource = require("./fileTemplates/intros.source");
const loggingSource = require("./fileTemplates/logging.source");
const modelSource = require("./fileTemplates/model.source");
const readmeSource = require("./fileTemplates/readme.source");
const routesSource = require("./fileTemplates/routes.source");
const schemaLoaderUtilSource = require("./fileTemplates/schemaLoaderUtil.source");
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
    const corsSource = `"use strict";

const cors = require("cors");

// set up cors. This will allow the api to be accessed from domains other than apis domain, i.e.
// other webapps from different domains. By default this is disabled for safety reasons, to prevent
// some third party website from accessing our api without permission.

${options.heroku ? `const herokuAPI = "https://YOUR-HEROKU-APP-NAME-HERE.herokuapp.com";` : ""}
const localSPA = "http://localhost:3000"; // please change port if different

// only the domains in this white list will be allowed to access the server.
const corsWhitelist = [
  "*", // placeholder, get rid of this wild card once you have selected specific domain names below
  ${options.heroku ? "herokuAPI," : ""}
  localSPA
];

const corsOptions = {
  origin: (origin, callback) => {
    // check if given origin is in the whitelist or if it's the api origin itself and only permit
    // those.
    if (corsWhitelist.indexOf(origin) !== -1 || !origin) callback(null, true);
    else callback(new Error("Not allowed by CORS"));
  }
};

module.exports = cors(corsOptions);
    `;

    const corsPath = `${app_name}/api/shared/cors.js`;
    fs.writeFileSync(corsPath, corsSource);
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
      const controllerIntroSource = `Controllers extract the data from requests pass it services and return their responses to users.
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
    const schemaLoaderSource = `"use strict";

const fs = require("fs");

exports.load = function(schemaFile) {
  try {
    const schemaObject = JSON.parse(fs.readFileSync(schemaFile));

    for (let field in schemaObject) findAndConvertTypes(schemaObject[field]);

    return schemaObject;
  } catch (err) {
    throw new Error(err);
  }
};

function convertStrToJavascript(string) {
  return new Function(\`return \${string}\`)();
}

function findAndConvertTypes(object) {
  // base case, type and default will always be present on the same level
  if (object.type) {
    object.type = convertStrToJavascript(object.type);

    if (object.default) {
      if (!Array.prototype.isPrototypeOf(object.default))
        object.default = convertStrToJavascript(object.default);
    }
    return;
  }

  // recursive case, drill deeper
  const objectFields = Object.keys(object);

  objectFields.forEach(field => {
    findAndConvertTypes(object[field]);
  });
}
    `;

    if (!options.inline) {
      const schemaLoaderPath = `${app_name}/_utils/mongooseJSONSchemaLoader.js`;
      fs.writeFileSync(schemaLoaderPath, schemaLoaderSource);
      return `  created: ${schemaLoaderPath}`;
    }
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

exports.index${capitalize(asset)} = async (req, res, next) => {
  try {
    const response = await ${asset}Service.index${capitalize(asset)}();
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

    return `created: ${controllerPath}`;
  } catch (err) {
    err = pathCheck(err);
    throw new Error(err);
  }
}

function createAllModelsFile(inline, apiVersion) {
  try {
    const inlineSource = allModelsSource.inlineSource(apiVersion);
    const jsonBackedSchemaSource = allModelsSource.jsonBackedSchemaSource(apiVersion);

    const allModelsPath = `./api/v${apiVersion}/models/all.models.js`;
    if (inline) fs.writeFileSync(allModelsPath, inlineSource);
    else fs.writeFileSync(allModelsPath, jsonBackedSchemaSource);
    return `       created: ${allModelsPath}`;
  } catch (err) {
    throw new Error(err);
  }
}

function createModelFileSync(asset, options) {
  try {
    const sapphireJSON = fs.readFileSync(`./sapphire.json`);
    const inline = JSON.parse(sapphireJSON).inline;

    createAllModelsFile(inline, options.apiv);

    let returnStr = ``;

    if (inline) {
      const modelInlineSource = `"use strict";
const mongoose = require("mongoose");

let ${capitalize(asset)}Schema = new mongoose.Schema(
  {
    createdDate: {
      type: Date,
      default: Date.now
    }
  },
  {
    getters: true
  }
);

${capitalize(asset)}Schema.pre("save", next => {
  const now = new Date();
  if (!this.createdDate) {
    this.createdDate = now;
  }
  next();
});

module.exports = mongoose.model("${capitalize(asset)}", ${capitalize(asset)}Schema);
      `;

      const modelInlineSourcePath = `./api/v${options.apiv}/models/${asset}.model.js`;
      fs.writeFileSync(modelInlineSourcePath, modelInlineSource);
      returnStr += `created: ${modelInlineSourcePath}`;
    } else {
      const modelJavaScriptSource = `"use strict";
const mongoose = require("mongoose");
const mongooseJSONSchemaLoader = require("../../../../_utils/mongooseJSONSchemaLoader");


let ${capitalize(asset)}Schema = new mongoose.Schema(
  mongooseJSONSchemaLoader.load("./api/v${options.apiv}/models/${asset}/${asset}.schema.json"),
  {
    getters: true
  }
);

${capitalize(asset)}Schema.pre("save", next => {
  const now = new Date();
  if (!this.createdDate) {
    this.createdDate = now;
  }
  next();
});

module.exports = mongoose.model("${capitalize(asset)}", ${capitalize(asset)}Schema);
      `;

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
      fs.writeFileSync(modelJavaScriptSourcePath, modelJavaScriptSource);
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
  const source = `"use strict";
const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");
const dotEnv = require("dotenv");

// make variables available from .env locally
dotEnv.config();

// Authentication middleware. When used, the
// Access Token must exist and be verified against
// the Auth0 JSON Web Key Set
module.exports = jwt({
  // Dynamically provide a signing key
  // based on the kid in the header and
  // the signing keys provided by the JWKS endpoint.
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: \`https://\${process.env.AUTH0_DOMAIN}/.well-known/jwks.json\`
  }),

  // Validate the audience and the issuer.
  audience: process.env.AUTH0_AUDIENCE,
  issuer: \`https://\${process.env.AUTH0_DOMAIN}/\`,
  algorithms: ["RS256"]
});
`;
  try {
    fs.writeFileSync(path, source);
    return `             created: ${path}`;
  } catch (err) {
    throw new Error(err);
  }
}

function createAllRoutesFile(apiVersion) {
  try {
    const allRoutesSource = `"use strict";

const fs = require('fs');

// import all the routes functions into an array.
// loop over the routes functions and apply them to the given app.

let routesArray = [];

const dir = './api/v${apiVersion}/routes/';

fs.readdirSync(dir).forEach(file => {
  if(file.match(/.routes.js/)){
    if(!file.match(/all.routes.js/)){
      file = file.replace(/.routes.js/, '.routes');
      routesArray.push(require(\`./\${file}\`));
    };
  }
});

module.exports = app => {
  for (const routes of routesArray) routes(app);
};
    `;

    const allRoutesPath = `./api/v${apiVersion}/routes/all.routes.js`;
    fs.writeFileSync(allRoutesPath, allRoutesSource);
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
    // TODO: smart populate ...
    const routesSource = `"use strict";
${options.auth ? 'const checkJwt = require("../../shared/middleware/auth");' : ""}

const API_VERSTION = "/api/v${options.apiv}";

module.exports = app => {
  const ${asset} = require("../controllers/${asset}.controller");

  app
    .route(\`\${API_VERSTION}/${asset}\`)
    .get(${asset}.index${capitalize(asset)})                ${
      options.auth ? "// regular route, no authorization required" : ""
    }
    .post(${options.auth ? "checkJwt, " : ""}${asset}.create${capitalize(asset)});   ${
      options.auth ? "// secured route, authorization required" : ""
    }

  app
    .route(\`\${API_VERSTION}/${asset}/:${asset}Id\`)
    .get(${asset}.show${capitalize(asset)})                 ${options.auth ? "// public" : ""}
    .put(${options.auth ? "checkJwt, " : ""}${asset}.update${capitalize(asset)})     ${
      options.auth ? "// authorized only" : ""
    }
    .delete(${options.auth ? "checkJwt, " : ""}${asset}.delete${capitalize(asset)}); ${
      options.auth ? "// authorized only" : ""
    }
}; 
`;

    const routesPath = `./api/v${options.apiv}/routes/${asset}.routes.js`;

    fs.writeFileSync(routesPath, routesSource);

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

function capitalize(string) {
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

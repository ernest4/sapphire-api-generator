#!/usr/bin/env node

const {
  initFileCreators,
  generateFileCreators,
  createGeneratedTestFileSync
} = require("./lib/fileCreators/fileCreators");
const directoryCreator = require("./lib/dirCreators/dirCreators");
const { deleteAssetFilesSync } = require("./lib/fileRemovers");
const { seed } = require("./lib/seed/seed");
const fs = require("fs");
const program = require("commander");
const inquirer = require("inquirer");
var packageJSON = require("./package.json");

const SAPPHIRE_VERSION = packageJSON.version;

program.version(`${SAPPHIRE_VERSION}`);

program
  .command("init [app_name]")
  .alias("i")
  .description(
    `
  initialize the base structure of your api:

  NOTE: you may run 'sapphire init' command with or without arguments.
  Without arguments an interactive session will be launched to guide you.
  `
  )
  .option("--no-git", "don't add a git repo")
  .option("--no-intro", "don't add the README.txt files which explain the directories")
  .option("--no-security", "don't add security middleware")
  .option("--no-readme", "don't add a README.md")
  .option("--no-ping", "don't add the /ping route for checking API status")
  .option("-H, --heroku", "add a Heroku Procfile for deploying to Heroku")
  .option("-l, --logging", "add logging middleware")
  .option(
    "-i, --inline",
    `generate the models within model.js file instead of separate schema.json

               WARNING: if you inline you will not be able to use Sapphire
               update command to update models' fields and/or create relations
               between models as well as seed them with the seed command. If
               you inline, it is now your responsibility to maintain the model
               schema and any relations.
               `
  )
  .action(async (app_name, options) => {
    if (!app_name) {
      const questions = [
        {
          type: "confirm",
          name: "git",
          message: "Add and init a git repo?",
          default: true
        },
        {
          type: "confirm",
          name: "intro",
          message: "Add the README.txt files which explain the directories?",
          default: true
        },
        {
          type: "confirm",
          name: "security",
          message: "Add security middleware?",
          default: true
        },
        {
          type: "confirm",
          name: "readme",
          message: "Add a README.md?",
          default: true
        },
        {
          type: "confirm",
          name: "ping",
          message: "Add the /ping route for checking API status?",
          default: true
        },
        {
          type: "confirm",
          name: "heroku",
          message: "Add a Heroku Procfile for deploying to Heroku?",
          default: false
        },
        {
          type: "confirm",
          name: "logging",
          message: "Add logging middleware?",
          default: false
        },
        {
          type: "input",
          name: "app_name",
          message: "Please enter the name of your api app:"
        }
      ];

      try {
        const options = await inquirer.prompt(questions);
        initializeAPI(options.app_name, options, SAPPHIRE_VERSION);
      } catch (err) {
        console.log(errMessage(err));
        process.exit(1);
      }
    } else {
      initializeAPI(app_name, options, SAPPHIRE_VERSION);
    }
  });

program
  .command("generate <asset>")
  .alias("g")
  .description("generate a database backed asset for your RESTlike api")
  // (WIP. COMING SOON) .option("--apiv <version>", "specify the api version under which to create the asset")
  .option("-m, --model", "only generate a model for this asset")
  .option("-a, --auth", "add authorization of routes")
  .action((asset, options) => {
    let generateGenerator = generate(asset, options);

    for (
      let iteration = generateGenerator.next();
      !iteration.done;
      iteration = generateGenerator.next()
    ) {
      if (iteration.value) console.log(`       ${iteration.value}`);
    }
  });

program
  .command("delete <asset>")
  .alias("d")
  .description("delete a database backed asset from your RESTlike api")
  //(WIP. COMMING SOON) .option("--apiv <version>", "specify the api version under which to delete the asset")
  .action((asset, options) => {
    deleteAsset(asset, options);
  });

program
  .command("seed <asset> [assets...]")
  .alias("s")
  .description(
    `generate dummy data for chosen asset(s): 
  
     EXAMPLE 1: generate dummy data for single asset

       $ sapphire seed user


     EXAMPLE 2: generate dummy data for multiple assets

       $ sapphire seed user book library


     EXAMPLE 3: generate dummy data for all assets

       $ sapphire seed all
    `
  )
  .option("-c, --count <count>", "specify the number of instances of the asset")
  .option("--apiv <version>", "specify the api version under which to seed the asset")
  .action((asset, args, options) => {
    checkIsInline();
    options.count = options.count || 10;
    options.apiv = options.apiv || 1;

    console.log(
      `
      seeding asset "${asset}":
      count: ${options.count}
      `
    );

    if (asset === "all") {
      const dir = `./api/v${options.apiv}/models/`;

      // JSON backed schema
      fs.readdirSync(dir).forEach(subdir => {
        if (subdir !== "all.models.js" && !subdir.match(/.txt/)) {
          fs.readdirSync(`${dir}${subdir}`).forEach(file => {
            if (file.match(/.model.js/)) {
              let asset = file.replace(/.model.js/, "");
              console.log(`      seeding ${asset}`);
              let subPath = `${subdir}/${file}`;
              seed(asset, options, subPath);
            }
          });
        }
      });
    } else {
      try {
        console.log(`      seeding ${asset}`);
        let subPath = `${asset}/${asset}.model`;
        seed(asset, options, subPath);

        args.forEach(asset => {
          console.log(`      seeding ${asset}`);
          let subPath = `${asset}/${asset}.model`;
          seed(asset, options, subPath);
        });
      } catch (err) {
        // handleGenerateTestsError(err);
        console.log(`failed to seed ${asset}`);
      }
    }

    console.log(`
      done`);
  });

// TODO: implement in the future
program
  .command("update <asset> [args...]")
  .alias("u")
  // (WIP. COMING SOON) .option("-r, --rest", "generate the routes, controller and services for existing model of asset")
  .option("--apiv <version>", "specify the api version under which to update the asset")
  .description(
    `change the asset's model, add relationships to other models and generate
tests:

     EXAMPLE 1: change the asset's model, add relationships to other models

       $ sapphire update user name:object , name.first:string required:’Enter
         User name’ , name.last:string required:’Enter User name’ , birthday:date
           , gender:string enum:[‘male’, ‘female’, ‘other’] default:’other’ , 
         socialId:string required:’User must have unique social ID’ unique , 
         createDate:date default:now , user:1m:hobby


     EXAMPLE 2: generate tests for the given asset after you modified its JSON
     schema

       $ sapphire update tests user


     EXAMPLE 3: generate tests for the given assets after you modified their JSON
     schema

       $ sapphire update tests user book library


     EXAMPLE 4: generate tests for all assets after you modified their JSON
     schema (this will regenerate all the tests from scratch)

       $ sapphire update tests all
  `
  )
  .action((asset, args, options) => {
    checkIsInline();
    if (asset === "tests") {
      if (args[0] === "all") {
        const apiv = options.apiv || 1;
        const dir = `./api/v${apiv}/models/`;

        // JSON backed schema
        fs.readdirSync(dir).forEach(subdir => {
          if (subdir !== "all.models.js" && !subdir.match(/.txt/)) {
            fs.readdirSync(`${dir}${subdir}`).forEach(file => {
              if (file.match(/.schema.json/)) {
                let asset = file.replace(/.schema.json/, "");
                console.log(`generating tests for ${asset}`);
                generateTests(asset, options);
              }
            });
          }
        });
      } else {
        args.forEach(asset => {
          console.log(`generating tests for ${asset}`);
          try {
            generateTests(asset, options);
          } catch (err) {
            handleGenerateTestsError(err);
          }
        });
      }
    } else {
      console.log(`updating asset ${asset}`);
      updateAssetModel(asset, args);
      console.log(`generating tests for ${asset}`);
      try {
        generateTests(asset, options);
      } catch (err) {
        handleGenerateTestsError(err);
      }
    }

    console.log(`done`);
  });

// // TODO: implement in the future
// program
//   .command("example <project>")
//   .alias("e")
//   .option("-a, --auth", "add authorization for the example")
//   .description(`Bootstrap an example API with at least two related models:

//   RELATIONSHIP: [one to many]: asset1 has many asset2

//     EXAMPLE 1: Will create an api for tasks and todos, where each task has a list of todos.

//     $ sapphire example todos

//   RELATIONSHIP: [many to many]: asset1 many to many asset2

//     EXAMPLE 2: Will create an api for customers and items, where each customer has many
//                items in their basket, but an item can belong to many customers too.

//     $ sapphire example shoppers
//   `)
//   .action((project, options) => {
//     // TODO: implement in the future
//     console.log(project);
//     console.log(options);
//   });

program.parse(process.argv);

function initializeAPI(app_name, options, sapphireVersion) {
  let initGenerator = init(app_name, options, sapphireVersion);

  for (let iteration = initGenerator.next(); !iteration.done; iteration = initGenerator.next()) {
    if (iteration.value) console.log(`       ${iteration.value}`);
  }
}

function* init(app_name, options, sapphireVersion) {
  const version = 1;
  const apiDirs = ["controllers", "models", "routes", "services"];
  const testDirs = ["custom", "generated"];

  try {
    yield `
    `;

    yield `initializing the api for ${app_name}:
    `;

    yield `creating directories:
    `;

    for (const dir of apiDirs) yield directoryCreator.createApiDir(app_name, version, dir);
    yield directoryCreator.createDir(`${app_name}/api/shared/middleware`);
    yield directoryCreator.createDir(`${app_name}/_utils`);
    for (const dir of testDirs) yield directoryCreator.createTestDir(app_name, version, dir);
    yield directoryCreator.createDir(`${app_name}/tests/unit`);
    yield directoryCreator.createDir(`${app_name}/config`);

    yield `
       creating files:
    `;

    for (const fileCreator of initFileCreators)
      yield fileCreator(app_name, options, sapphireVersion);

    yield `
       success!

       $ cd ${app_name}
       $ npm install
       $ sapphire generate my_first_asset
       $ npm run test
       $ npm run nodemon
    `;

    return;
  } catch (err) {
    console.log(errMessage(err));
    process.exit(1);
  }
}

function* generate(asset, options) {
  const version = options.apiv || 1;
  options.apiv = version;

  const apiDirs = ["controllers", "models", "routes", "services"];
  const testDirs = ["custom", "generated"];

  try {
    yield `
    generating asset "${asset}":
   `;

    if (options.apiv > 1) {
      for (const dir of apiDirs) yield directoryCreator.createApiDir(null, version, dir);
      for (const dir of testDirs) yield directoryCreator.createTestDir(null, version, dir);
    }

    for (const fileCreator of generateFileCreators) yield fileCreator(asset, options);

    yield `
       success!
    `;

    if (options.model) return;

    yield `
       Endpoints:
       GET:    /api/v${options.apiv}/${asset}
       POST:   /api/v${options.apiv}/${asset}

       GET:    /api/v${options.apiv}/${asset}/:${asset}Id
       PUT:    /api/v${options.apiv}/${asset}/:${asset}Id
       DELETE: /api/v${options.apiv}/${asset}/:${asset}Id
    `;

    return;
  } catch (err) {
    console.log(errMessage(err));
    process.exit(1);
  }
}

function deleteAsset(asset, options) {
  options.apiv = options.apiv || 1;
  console.log(`
     deleting asset ${asset}`);

  let status = deleteAssetFilesSync(asset, options);
  console.log(status);
  return;
}

function* update(asset, options) {
  return "updating...";
}

function updateAssetModel(asset, args) {
  console.log("updateing asset model");
  console.log(asset);
  console.log(args);
  // load the model json into object
  // parse the commands
  // apply the commands to object
  // save object as json
}

function generateTests(asset, opts) {
  try {
    const modelJSON = fs.readFileSync(`./api/v1/models/${asset}/${asset}.schema.json`);
    let modelObject = JSON.parse(modelJSON);

    let options = {};
    options.auth = modelObject.auth.default;
    options.apiv = opts.apiv || 1;

    createGeneratedTestFileSync(asset, options, modelObject);
  } catch (err) {
    throw err; // rethrow
  }
}

function errMessage(err) {
  return `

       ERROR:

       There was an issue :/
       Could be a bug! Please let me know :)
       GITHUB: https://github.com/ernest4/sapphire-api-generator

       ISSUE: ${err.message}
`;
}

function checkIsInline() {
  try {
    const sapphireJSON = fs.readFileSync(`./sapphire.json`);
    const inline = JSON.parse(sapphireJSON).inline;

    if (inline) {
      console.log(`
      FAILED: the models are inlined.
      
      As the models are inlined, you will not be able to use Sapphire
      update command to update models' fields and/or create relations
      between models as well as seed them with the seed command.
      `);
      process.exit(1);
    }
  } catch (err) {
    throw new Error(err);
  }
}

function handleGenerateTestsError(err) {
  console.log(err);
  if (err.message.match(/unsupported_field_type/)) {
    if (err.required) {
      console.log(`
  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  FAILED: Unrecognised or unsupported field type: ${err.type}
  
  Model: ${err.asset}
  
  As this field is marked as 'required' Sapphire cannot proceed with test
  generation for this model. Please write custom tests for this model!
  
  NOTE: This field type may be supported in future version of Sapphire.
  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

  `);
    }
  }
}

#!/usr/bin/env node

const { initFileCreators, generateFileCreators } = require("./lib/fileCreators/fileCreators");
const directoryCreator = require("./lib/dirCreators/dirCreators");
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

               WARNING: if you inline you will not be able to use Sapphire update command
               to update models' fields and/or create relations between models. If you
               inline, it is now your responsibility to maintain the model schema and any
               relations.
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

// program
//   .command("delete <asset>")
//   .alias("g")
//   .description("delete a database backed asset from your RESTlike api")
//   .option("--apiv <version>", "specify the api version under which to delete the asset")
//   .option("-m, --model", "only delete a model for this asset")
//   .action((asset, options) => {
//     let deleteGenerator = deleteAsset(asset, options);

//     for (
//       let iteration = deleteGenerator.next();
//       !iteration.done;
//       iteration = deleteGenerator.next()
//     ) {
//       if (iteration.value) console.log(`       ${iteration.value}`);
//     }
//   });

program
  .command("seed <asset>")
  .alias("s")
  .description("generate dummy data for chosen asset")
  .option("-c, --count <count>", "specify the number of instances of the asset")
  .action((asset, options) => {
    const count = options.count || 10;

    console.log(
      `
      seeding asset "${asset}":
      count: ${count}
      
      `
    );

    console.log(seed(asset, options));
  });

// // TODO: implement in the future
// program
//   .command("update <asset> [args...]")
//   .alias("u")
//   .option("-r, --rest", "generate the routes, controller and services for existing model of asset")
//   .description(
//     `change the asset's model or add relationships to other models:

//   RELATIONSHIP: [one to many]: asset1 has many asset2

//     EXAMPLE 1: one author has many books.

//     $ sapphire update author has many book

//   RELATIONSHIP: [many to many]: asset1 many to many asset2

//     EXAMPLE 2: An editor has worked on many articles and an article can have many editors.

//     $ sapphire update editor many to many article

//     EXAMPLE 3: alternatively, you may define relationships one by one.

//     $ sapphire update editor has many article
//     $ sapphire update article has many editor
//   `
//   )
//   .action((asset, args) => {
//     // TODO: implement in the future
//     console.log(asset);
//     console.log(args);
//   });

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
  const dirs = ["controllers", "models", "routes", "services"];

  try {
    yield `
    `;

    yield `initializing the api for ${app_name}:
    `;

    yield `creating directories:
    `;

    for (const dir of dirs) yield directoryCreator.createApiDir(app_name, version, dir);
    yield directoryCreator.createDir(`${app_name}/api/shared/middleware`);
    yield directoryCreator.createDir(`${app_name}/_utils`);

    yield `
       creating files:
    `;

    for (const fileCreator of initFileCreators)
      yield fileCreator(app_name, options, sapphireVersion);

    yield `
       success!

       $ cd ${app_name}
       $ npm install
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

  const dirs = ["controllers", "models", "routes", "services"];

  try {
    yield `
    generating asset "${asset}":
   `;

    if (options.apiv > 1)
      for (const dir of dirs) yield directoryCreator.createApiDir(null, version, dir);

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

function* deleteAsset(asset, options) {
  return "deleting...";
}

function* seed(asset, options) {
  return "seeding...";
}

function* update(asset, options) {
  return "updating...";
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

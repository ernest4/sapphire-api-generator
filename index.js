#!/usr/bin/env node

const fc = require("./lib/fileCreators");
const dc = require("./lib/dirCreators");
const fs = require("fs");
const program = require("commander");

const VERSION = "0.1.0"; // TODO: read this from package.json

program.version(`${VERSION}`);

program
  .command("init <app_name>")
  .alias("i")
  .description("initialize the base structure of your api")
  .option("--no-git", "don't add a git repo")
  .option("--no-intro", "don't add the _intro.txt files which explain the directories")
  .option("--no-security", "don't add security middleware")
  .option("--no-readme", "don't add a README.md")
  .option("-H, --heroku", "add a Heroku Procfile for deploying to Heroku")
  .option("-a, --auth", "add authorization of routes")
  .action((app_name, options) => {
    console.log(
      `
       initializing the api for ${app_name}:
      `
    );

    let initGenerator = init(app_name, options);
    for (let iteration = initGenerator.next(); !iteration.done; iteration = initGenerator.next()) {
      if (iteration.value) console.log(`       ${iteration.value}`);
    }
  });

program
  .command("generate <asset>")
  .alias("g")
  .description("generate a database backed asset for your RESTlike api")
  .option("--api_version <version>", "specify the api version under which to create the asset")
  .action((asset, options) => {
    const version = `/api/v${options.api_version || 1}`;

    console.log(
      `
       generating asset "${asset}":

       routes:     ${version}/routes/${asset}.routes.js
       controller: ${version}/controllers/${asset}.controller.js
       model:      ${version}/models/${asset}.model.js
       service:    ${version}/services/${asset}.service.js

       Endpoints:
         GET:    ${version}/${asset}
         POST:   ${version}/${asset}

         GET:    ${version}/${asset}/:${asset}Id
         PUT:    ${version}/${asset}/:${asset}Id
         DELETE: ${version}/${asset}/:${asset}Id

      `
    );

    console.log(generate(asset, options));
  });

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
//   .description(`change the asset's model or add relationships to other models:
  
//   RELATIONSHIP: [one to many]: asset1 has many asset2

//     EXAMPLE 1: one author has many books.

//     $ sapphire update author has many book

//   RELATIONSHIP: [many to many]: asset1 many to many asset2

//     EXAMPLE 2: An editor has worked on many articles and an article can have many editors.
    
//     $ sapphire update editor many to many article

//     EXAMPLE 3: alternatively, you may define relationships one by one.

//     $ sapphire update editor has many article
//     $ sapphire update article has many editor
//   `)
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
//               items in their basket, but an item can belong to many customers too.

//     $ sapphire example shoppers
//   `)
//   .action((project, options) => {
//     // TODO: implement in the future
//     console.log(project);
//     console.log(options);
//   });

program.parse(process.argv);

function* init(app_name, options) {
  const version = 1;
  const dirs = ["controllers", "models", "routes", "services"];
  const fileCreators = fc.getFileCreators();

  try {
    yield `creating directories:
    `;
    for (const dir of dirs) yield dc.apiDirCreator(app_name, version, dir);
    yield dc.dirCreator(`${app_name}/api/shared/middleware`);
    yield dc.dirCreator(`${app_name}/_utils`);

    yield `
       creating files:
    `;

    for (const fileCreator of fileCreators) yield fileCreator(app_name, options);

    yield `
       success:

       $ cd ${app_name}
       $ npm run start
    `;

    return;
  } catch (err) {
    console.log(`

       ERROR:

       There was an issue :/
       Could be a bug! Please let me know :)

       ISSUE: ${err.message}
    `);
    process.exit(1);
  }
}

function* generate(asset, options) {
  return "generating...";
}

function* seed(asset, options) {
  return "seeding...";
}

function* update(asset, options) {
  return "updating...";
}

#!/usr/bin/env node

const program = require("commander");

const VERSION = "0.1.0"; // TODO: read this from package.json

program.version(`${VERSION}`);

program
  .command("init <app_name>")
  .alias("i")
  .description("initialize the base structure of your api")
  .option("--no-git", "don't add a git repo")
  .option("--no-intro", "don't add the _intro.txt files which explain the directories")
  .option("-H, --heroku", "add a Heroku Procfile for deploying to Heroku")
  // .option("--test <test>", "that's just for me don't mind that ;)")
  .action((app_name, options) => {
    console.log(`app name: ${app_name}, test: ${options.test}`);
    if (options.heroku) console.log("yay heroku!");
    if (!options.git) console.log("no git!");
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
  });

program.command("seed user 100").alias("s");

program.parse(process.argv);

#!/usr/bin/env node

const program = require("commander");

const VERSION = "0.1.0"; // TODO: read this from package.json

program.version(`v${VERSION}`);

program
  .command('init <app_name>')
  .description('initialize the base structure of your application')
  .option("--no-git", "don't add a git repo")
  .option("-H, --heroku", "add a Heroku Procfile for deploying to Heroku")
  // .option("--test <test>", "that's just for me don't mind that ;)")
  .action((app_name, options) => {
    console.log(`app name: ${app_name}, test: ${options.test}`);
    if (options.heroku) console.log("yay heroku!");
    if (!options.git) console.log("no git!");
  });
  
program.parse(process.argv);

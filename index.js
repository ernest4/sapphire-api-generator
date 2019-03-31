#!/usr/bin/env node

const program = require("commander");

const VERSION = "0.1.0"; // TODO: read this from package.json

program
  .arguments("<app_name>")
  .version(`v${VERSION}`)
  .option("--no-git", "don't add a git repo")
  .option("-H, --heroku", "add a Heroku Procfile")
  .option("--test <test>", "that's just for me don't mind that ;)")
  .action(app_name => {
    console.log(`app name: ${app_name}, test: ${program.test}`);
    if (program.heroku) console.log("yay heroku!");
    if (!program.git) console.log("no git!");
  })
  .parse(process.argv);

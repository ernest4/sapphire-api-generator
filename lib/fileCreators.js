"use strict";

const fs = require("fs");

function createEnvFileSync(app_name) {
  // TODO: implement logic to determine what goes into .env for eg if auth is used, then put auth
  // vars in here...
  const envSource = "WIP";

  const envPath = `${app_name}/.env`;
  fs.writeFileSync(envPath, envSource);
  return `created: ${envPath}`;
}

function createServerFileSync(app_name) {
  // TODO: load the real source...
  const serverSource = "hello!";

  fs.writeFileSync(`${app_name}/server.js`, serverSource);
  return `created: ${app_name}/server.js`;
}

function createHerokuFileSync(app_name, options) {
  const procfileSource = "web: node server.js";

  if (options.heroku) {
    const procfilePath = `${app_name}/Procfile`;
    fs.writeFileSync(procfilePath, procfileSource);
    return `created: ${procfilePath}`;
  }
}

function createGitFilesSync(app_name, options) {
  // TODO: need to make .git and initialize repo...
  const gitignoreSource = ".env";

  if (options.git) {
    const gitignorePath = `${app_name}/.gitignore`;
    fs.writeFileSync(gitignorePath, gitignoreSource);
    return `created: ${gitignorePath}`;
  }
}

module.exports = {
  getFileCreators: function() {
    let array = [];
    array.push(createEnvFileSync);
    array.push(createServerFileSync);
    array.push(createHerokuFileSync);
    array.push(createGitFilesSync);
    return array;
  }
};

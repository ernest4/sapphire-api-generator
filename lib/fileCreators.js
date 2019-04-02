"use strict";

const fs = require("fs");

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

function createServerFileSync(app_name) {
  try {
    // TODO: load the real source...
    const serverSource = "hello!";

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
    const readmeSource = `This project was generated with Sapphire API Generator`;

    if (options.readme) {
      const readmePath = `${app_name}/README.md`;
      fs.writeFileSync(readmePath, readmeSource);
      return `  created: ${readmePath}`;
    }
  } catch (err) {
    throw new Error(err);
  }
}

function createIntroTXTFileSync(app_name, options) {
  try {
    if (options.intro) {
      // TODO: smartly populate intro...

      const utilsIntroSource = `WIP utils intro...`;
      const sharedIntroSource = `WIP shared intro...`;
      const controllerIntroSource = `WIP controller intro...`;
      const modelsIntroSource = `WIP models intro...`;
      const routesIntroSource = `WIP routes intro...`;
      const servicesIntroSource = `WIP services intro...`;

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

module.exports = {
  getFileCreators: function() {
    let array = [];
    array.push(createEnvFileSync);
    array.push(createServerFileSync);
    array.push(createHerokuFileSync);
    array.push(createGitFilesSync);
    array.push(createReadMeFileSync);
    array.push(createIntroTXTFileSync);
    return array;
  }
};

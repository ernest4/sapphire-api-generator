"use strict";

exports.packageJSONObject = (app_name, options, sapphireVersion) => {
  const packageObject = {
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
  };

  // TODO: trim down the dependencies to bare minimum needed based on what user wants

  if (options.security) packageObject.dependencies["helmet"] = "^3.16.0";

  return packageObject;
};

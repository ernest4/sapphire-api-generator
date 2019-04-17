"use strict";

exports.packageJSONObject = (app_name, options, sapphireVersion) => {
  const packageObject = {
    name: app_name,
    version: "0.1.0",
    description: `back end api for the ${app_name} app generate with Sapphire v${sapphireVersion}`,
    main: "server.js",
    scripts: {
      test: "NODE_ENV=test mocha tests --recursive --exit",
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
      mongoose: "^5.5.2"
    },
    devDependencies: {
      nodemon: "^1.18.10",
      chai: "^4.2.0",
      "chai-http": "^4.2.1",
      mocha: "^6.1.2"
    }
  };

  // TODO: trim down the dependencies to bare minimum needed based on what user wants

  if (options.security) packageObject.dependencies["helmet"] = "^3.16.0";

  return packageObject;
};

"use strict";

const fs = require("fs");

exports.seed = (asset, options, subPath) => {
  // console.log(`seeding ${asset}`);
  // console.log(`count ${options.count}`);

  // const sapphireJSON = fs.readFileSync(`./sapphire.json`);
  // const { appName } = JSON.parse(sapphireJSON);

  const path = `${process.cwd()}/api/v${options.apiv}/models/`;

  const Asset = require(`${path}${subPath}`);

  for (let i = 0; i < options.count; i++) {
    // let asset = new Asset(assetFields);
    // asset.save((err, asset) => {});
  }
  return "done";
};

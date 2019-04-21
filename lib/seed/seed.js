"use strict";

const fs = require("fs");

const { generatePopulatedModelObject } = require("../fileCreators/fileTemplates/js/test.source");

exports.seed = (asset, options, subPath) => {
  // console.log(`seeding ${asset}`);
  // console.log(`count ${options.count}`);

  const path = `${process.cwd()}/api/v${options.apiv}/models/`;
  const fullPathModel = `${path}${subPath}`;
  const fullPathSchema = `${path}${asset}/${asset}.schema.json`;

  // console.log(fullPath);
  const modelJSON = fs.readFileSync(fullPathSchema);

  // console.log(modelJSON);
  let modelObject = JSON.parse(modelJSON);

  const Asset = require(fullPathModel);

  for (let i = 0; i < options.count; i++) {
    console.log(generatePopulatedModelObject(asset, modelObject));
    // let asset = new Asset(generatePopulatedModelObject(asset, modelObject));
    // asset.save((err, asset) => {
    //   if (err) throw new Error(err);
    // });
  }
  return;
};

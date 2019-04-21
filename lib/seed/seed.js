"use strict";

const fs = require("fs");

const { generatePopulatedModelObject } = require("../fileCreators/fileTemplates/js/test.source");
const { randomString } = require("./seed.data");

exports.seed = async (asset, options, subPath) => {
  // console.log(`seeding ${asset}`);
  // console.log(`count ${options.count}`);

  const path = `${process.cwd()}/api/v${options.apiv}/models/`;
  const fullPathModel = `${path}${subPath}`;
  console.log(fullPathModel);
  const searchString = new RegExp(`${asset}.model`);
  const fullPathSchema = fullPathModel.replace(searchString, `${asset}.schema.json`);

  console.log(fullPathSchema);

  const modelJSON = fs.readFileSync(fullPathSchema);
  const modelObject = JSON.parse(modelJSON);
  console.log(`

  `);
  console.log(modelObject);

  const Asset = require(fullPathModel);

  try {
    let assets = await Asset.find({});
    console.log(`
  ASSET COUNT
  `);
    console.log(assets);
    console.log(JSON.stringify(asset));
  } catch (err) {
    console.log(err);
  }

  for (let i = 0; i < options.count; i++) {
    console.log(`

  `);
    let modelCopy = JSON.parse(JSON.stringify(modelObject));
    console.log(generatePopulatedModelObject(asset, modelCopy));
    console.log(randomString(10));
    // let asset = new Asset(generatePopulatedModelObject(asset, modelObject));
    // asset.save((err, asset) => {
    //   if (err) throw new Error(err);
    // });
  }
  return;
};

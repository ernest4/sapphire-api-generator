"use strict";

const fs = require("fs");

const { generatePopulatedModelObject } = require("../fileCreators/fileTemplates/js/test.source");
const { randomString } = require("./seed.data");
const server = require(`${process.cwd()}/server`); // your app

exports.seed = async (asset, options, subPath) => {
  try {
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

    // try {
    //   let assets = await Asset.find({});
    //   console.log(`
    // ASSET COUNT
    // `);
    //   console.log(assets.length);
    //   console.log(JSON.stringify(assets));
    // } catch (err) {
    //   console.log(err);
    // }

    for (let i = 0; i < options.count; i++) {
      console.log(`

  `);
      console.log(`
  next cycle
  `);
      let modelCopy = JSON.parse(JSON.stringify(modelObject));
      console.log(`
  got model copy
  `);
      // let assetToSave = {};
      let assetToSave = generatePopulatedModelObject(asset, modelCopy, i);
      console.log(`
  got asset to save
  `);
      // let randomStringID = randomString(null, i);

      // console.log(randomStringID);

      // assetToSave.socialId = randomStringID;
      // assetToSave.name = { last: "one", first: "two" };

      console.log(assetToSave);

      let preSave = new Asset(assetToSave);
      console.log(`
      pre saved
      `);
      let savedAsset = await preSave.save();
      console.log(`
      saved assed:
      `);
      console.log(savedAsset);
    }

    console.log(`seeded ${asset} ${options.count} times`);
    return;
  } catch (err) {
    console.log(`failed to seed ${asset}`);
    throw err;
  }
};

"use strict";

const fs = require("fs");

// const mongoose = require(`${process.cwd()}/node_modules/mongoose`);
const dotEnv = require(`${process.cwd()}/node_modules/dotenv`);
const config = require(`${process.cwd()}/config/index`);
const allModels = require(`${process.cwd()}/api/v1/models/all.models`);

// make variables available from .env locally
dotEnv.config();

// config constants
const MONGODB_URI = config.db;

const { generatePopulatedModelObject } = require("../fileCreators/fileTemplates/js/test.source");

exports.seed = async (asset, options, subPath, lastOne) => {
  const mongoose = require(`${process.cwd()}/node_modules/mongoose`);
  // connect mongoose
  let connHandle = await mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    bufferCommands: false
  });

  try {
    const path = `${process.cwd()}/api/v${options.apiv}/models/`;
    const fullPathModel = `${path}${subPath}`;
    const searchString = new RegExp(`${asset}.model`);
    const fullPathSchema = fullPathModel.replace(searchString, `${asset}.schema.json`);

    const modelJSON = fs.readFileSync(fullPathSchema);
    const modelObject = JSON.parse(modelJSON);

    const Asset = await require(fullPathModel);

    for (let i = 0; i < options.count; i++) {
      let modelCopy = JSON.parse(JSON.stringify(modelObject));
      let assetToSave = generatePopulatedModelObject(asset, modelCopy, i);
      let preSave = new Asset(assetToSave);
      await preSave.save();
    }

    try {
      let newAssets = await Asset.find({}).select("_id");
      console.log(`
      asset ${asset} new count ${newAssets.length}
    `);
      await connHandle.connection.close();
    } catch (err) {
      throw err;
    }
  } catch (err) {
    console.log(`failed to seed ${asset}`);
    throw err;
  }
};

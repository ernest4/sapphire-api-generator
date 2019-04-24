"use strict";

const capitalize = require("../../../utils/capitalize");

exports.controllerSource = (asset, options) => `"use strict";

const ${asset}Service = require("../services/${asset}.service");

exports.index${capitalize(asset)} = async (req, res, next) => {
  ${options.ref ? `const { references } = req.query;` : ""}
  try {
    const response = await ${asset}Service.index${capitalize(asset)}(${
  options.ref ? `references` : ""
});
    res.json(response); // respond to user
  } catch (err) {
    next(err); // pass the error to error handling middleware
  }
};

exports.create${capitalize(asset)} = async (req, res, next) => {
  const { body } = req;
  try {
    const response = await ${asset}Service.create${capitalize(asset)}(body);
    res.json(response); // respond to user
  } catch (err) {
    next(err); // pass the error to error handling middleware
  }
};

exports.show${capitalize(asset)} = async (req, res, next) => {
  const { ${asset}Id } = req.params;
  try {
    const response = await ${asset}Service.show${capitalize(asset)}(${asset}Id);
    res.json(response); // respond to user
  } catch (err) {
    next(err); // pass the error to error handling middleware
  }
};

exports.update${capitalize(asset)} = async (req, res, next) => {
  const { ${asset}Id } = req.params;
  const { body } = req;
  try {
    const response = await ${asset}Service.update${capitalize(asset)}(${asset}Id, body);
    res.json(response); // respond to user
  } catch (err) {
    next(err); // pass the error to error handling middleware
  }
};

exports.delete${capitalize(asset)} = async (req, res, next) => {
  const { ${asset}Id } = req.params;
  try {
    const response = await ${asset}Service.delete${capitalize(asset)}(${asset}Id);
    res.json(response); // respond to user
  } catch (err) {
    next(err); // pass the error to error handling middleware
  }
};
`;

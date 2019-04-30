"use strict";

const capitalize = require("../../../utils/capitalize");

exports.modelInlineSource = asset => `"use strict";
const mongoose = require("mongoose");

let ${capitalize(asset)}Schema = new mongoose.Schema(
  {
    // your schema here
  },
  {
    getters: true,
    timestamps: true
  }
);

module.exports = mongoose.model("${capitalize(asset)}", ${capitalize(asset)}Schema);
`;

exports.modelJavaScriptSource = (asset, options) => `"use strict";
const mongoose = require("mongoose");
const mongooseJSONSchemaLoader = require("../../../../_utils/mongooseJSONSchemaLoader");


let ${capitalize(asset)}Schema = new mongoose.Schema(
  mongooseJSONSchemaLoader.load("./api/v${options.apiv}/models/${asset}/${asset}.schema.json"),
  {
    getters: true,
    timestamps: true
  }
);

module.exports = mongoose.model("${capitalize(asset)}", ${capitalize(asset)}Schema);
`;

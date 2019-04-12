"use strict";

const capitalize = require("../../../utils/capitalize");

exports.serviceSource = asset => `"use strict";
const mongoose = require("mongoose");

const ${capitalize(asset)} = mongoose.model("${capitalize(asset)}");

exports.index${capitalize(asset)} = async () => {
  try {
    const ${asset} = await ${capitalize(asset)}.find({});
    return ${asset};
  } catch (err) {
    return err;
  }
};

exports.create${capitalize(asset)} = async ${asset} => {
  try {
    // await ${capitalize(asset)}.once('index'); // TESTING...
    const new${capitalize(asset)} = new ${capitalize(asset)}(${asset});
    const saved${capitalize(asset)} = await new${capitalize(asset)}.save();
    return saved${capitalize(asset)};
  } catch (err) {
    return err;
  }
};

exports.show${capitalize(asset)} = async ${asset}Id => {
  try {
    const ${asset} = await ${capitalize(asset)}.findById(${asset}Id);
    return ${asset};
  } catch (err) {
    return err;
  }
};

exports.update${capitalize(asset)} = async (${asset}Id, new${capitalize(asset)}Body) => {
  try {
    const updated${capitalize(asset)} = await ${capitalize(
  asset
)}.findOneAndUpdate({ _id: ${asset}Id }, new${capitalize(asset)}Body, { new: true });
    return updated${capitalize(asset)};
  } catch (err) {
    return err;
  }
};

exports.delete${capitalize(asset)} = async ${asset}Id => {
  try {
    await ${capitalize(asset)}.deleteOne({ _id: ${asset}Id });
    return { message: "${asset} successfully deleted" };
  } catch (err) {
    return err;
  }
};    
`;

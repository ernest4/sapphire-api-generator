"use strict";

exports.schemaLoaderUtilSource = () => `"use strict";

const mongoose = require("mongoose");
const fs = require("fs");

exports.load = function(schemaFile) {
  try {
    const schemaObject = JSON.parse(fs.readFileSync(schemaFile));

    for (let field in schemaObject) findAndConvertTypes(schemaObject[field], schemaObject, field);

    return schemaObject;
  } catch (err) {
    throw new Error(err);
  }
};

function convertStrToJavascript(string) {
  // special cases to handle mongoose specific types
  switch (string) {
    case "Schema.Types.Mixed":
      return mongoose.Schema.Types.Mixed;
    case "mongoose.Mixed":
      return mongoose.Mixed;
    case "Schema.Types.Decimal128":
      return mongoose.Schema.Types.Decimal128;
    case "Schema.Types.ObjectId":
      return mongoose.Schema.Types.ObjectId;
    case "mongoose.Schema.ObjectId":
      return mongoose.Schema.ObjectId;
    case "[Schema.Types.Mixed]":
      return [mongoose.Schema.Types.Mixed];
    case "[Schema.Types.ObjectId]":
      return [mongoose.Schema.Types.ObjectId];
    case "[mongoose.Schema.ObjectId]":
      return [mongoose.Schema.ObjectId];
    case "[[Schema.Types.Mixed]]":
      return [[mongoose.Schema.Types.Mixed]];
  }

  // for everything else...
  return new Function(\`return \${string}\`)();
}

function findAndConvertTypes(object, parent, field) {
  // base case, type and default will always be present on the same level

  transformTypeLiteral(object, parent, field);

  if (object.type) {
    object.type = convertStrToJavascript(object.type);

    if (object.default) {
      if (!Array.prototype.isPrototypeOf(object.default))
        object.default = convertStrToJavascript(object.default);
    }
    return;
  }

  // recursive case, drill deeper
  const objectFields = Object.keys(object);

  objectFields.forEach(field => {
    findAndConvertTypes(object[field], object, field);
  });
}

function transformTypeLiteral(model, parent, field) {
  console.log(\`
  model
  \`);
  console.log(model); // TESING

  const types = ["String"];

  // const fields = Object.keys(model);
  // for (const field of fields) {
  for (const type of types) {
    // console.log(\`
    // model
    // \`);
    // console.log(model);
    // console.log(\`
    // model[field]
    // \`);
    // console.log(model[field]);

    // console.log(\`
    // type
    // \`);
    // console.log(type);
    // console.log(\`

    // \`);
    // if (field !== "type" && field !== "of" && model[field] === type) {
    if (model === type) {
      console.log(\`
        FOUND IT!
        \`);
      // model[field] = { type };
      parent[field] = { type };
    }
    // return type;
  }
  // }
  // }

  return false;
}
`;

"use strict";

exports.schemaLoaderUtilSource = () => `"use strict";

const fs = require("fs");

exports.load = function(schemaFile) {
  try {
    const schemaObject = JSON.parse(fs.readFileSync(schemaFile));

    for (let field in schemaObject) findAndConvertTypes(schemaObject[field]);

    return schemaObject;
  } catch (err) {
    throw new Error(err);
  }
};

function convertStrToJavascript(string) {
  return new Function(\`return \${string}\`)();
}

function findAndConvertTypes(object) {
  // base case, type and default will always be present on the same level
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
    findAndConvertTypes(object[field]);
  });
}
`;

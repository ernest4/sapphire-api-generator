"use strict";

exports.inlineSource = apiVersion => `"use strict";

const fs = require("fs");

// simply import the models to execute their code

const dir = "./api/v${apiVersion}/models/";

// inline
fs.readdirSync(dir).forEach(file => {
  if (file.match(/.model.js/)) {
    file = file.replace(/.model.js/, ".model");
    require(\`./\${file}\`);
  }
});
`;

exports.jsonBackedSchemaSource = apiVersion => `"use strict";

const fs = require("fs");

// simply import the models to execute their code

const dir = "./api/v${apiVersion}/models/";

// JSON backed schema
fs.readdirSync(dir).forEach(subdir => {
  if (subdir !== "all.models.js" && subdir !== "_intro.txt") {
    fs.readdirSync(\`\${dir}\${subdir}\`).forEach(file => {
      if (file.match(/.model.js/)) {
        file = file.replace(/.model.js/, ".model");
        require(\`./\${subdir}/\${file}\`);
      }
    });
  }
});
`;
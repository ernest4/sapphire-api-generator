"use strict";

const capitalize = require("../../utils/capitalize");

exports.routesSource = (asset, options) => `"use strict";
${options.auth ? 'const checkJwt = require("../../shared/middleware/auth");' : ""}

const API_VERSTION = "/api/v${options.apiv}";

module.exports = app => {
  const ${asset} = require("../controllers/${asset}.controller");

  app
    .route(\`\${API_VERSTION}/${asset}\`)
    .get(${asset}.index${capitalize(asset)})                ${
  options.auth ? "// regular route, no authorization required" : ""
}
    .post(${options.auth ? "checkJwt, " : ""}${asset}.create${capitalize(asset)});   ${
  options.auth ? "// secured route, authorization required" : ""
}

  app
    .route(\`\${API_VERSTION}/${asset}/:${asset}Id\`)
    .get(${asset}.show${capitalize(asset)})                 ${options.auth ? "// public" : ""}
    .put(${options.auth ? "checkJwt, " : ""}${asset}.update${capitalize(asset)})     ${
  options.auth ? "// authorized only" : ""
}
    .delete(${options.auth ? "checkJwt, " : ""}${asset}.delete${capitalize(asset)}); ${
  options.auth ? "// authorized only" : ""
}
}; 
`;

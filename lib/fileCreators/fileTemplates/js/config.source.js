"use strict";

exports.developmentSource = () => `"use strict";

const dotEnv = require("dotenv");
// make variables available from .env locally
dotEnv.config();

module.exports = {
  env: "development",
  db: \`mongodb://localhost/\${process.env.DEVELOPMENT_DB}\`,
  port: process.env.PORT || 3001
};
`;

exports.indexSource = () => `"use strict";

const dotEnv = require("dotenv");
// make variables available from .env locally
dotEnv.config();

const env = process.env.NODE_ENV || "development";
const config = require(\`./\${env}\`);

module.exports = config;
`;

exports.productionSource = () => `"use strict";

const dotEnv = require("dotenv");
// make variables available from .env locally
dotEnv.config();

module.exports = {
  env: "production",
  db: process.env.MONGODB_URI,
  port: process.env.PORT || 3001
};
`;

exports.testSource = () => `"use strict";

const dotEnv = require("dotenv");
// make variables available from .env locally
dotEnv.config();

module.exports = {
  env: "test",
  db: \`mongodb://localhost/\${process.env.DEVELOPMENT_DB}Test\`,
  port: process.env.PORT || 3100
};
`;

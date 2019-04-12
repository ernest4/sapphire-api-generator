"use strict";

exports.serverSource = (app_name, options) => `const os = require("os");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
${options.security ? 'const helmet = require("helmet");' : ""}
const dotEnv = require("dotenv");
const config = require("./config/index");
const allModels = require("./api/v1/models/all.models");
const allRoutes = require("./api/v1/routes/all.routes");
const customCors = require("./api/shared/cors");
${options.logging ? 'const logging = require("./api/shared/middleware/logging");' : ""}

// make variables available from .env locally
dotEnv.config();

// config constants
const PORT = config.port;
const MONGODB_URI = config.db;

// initialize the app
const app = express();

// connect mongoose
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true
});

// connect middleware
${options.security ? "app.use(helmet());" : ""}
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(customCors);
${options.logging ? "if (config.env !== \"test\") {app.use(logging.logRequest);" : ""}

// register routes
allRoutes(app);

${
  options.ping
    ? `// server status ping
app.get("/ping", (req, res) => {
  res.json({
    pong: {
      server_time: new Date(),
      os_info: {
        platform: os.platform(),
        release: os.release(),
        arch: os.arch(),
        cpus: Object.values(os.cpus()).map(cpu => ({ model: cpu.model, speed: cpu.speed })),
        endiannes: os.endianness(),
        free_memory: { free_memory: os.freemem() / 1024 / 1024, unit: "MB" },
        totalmem: { totalmem: os.totalmem() / 1024 / 1024, unit: "MB" },
        uptime: { uptime: os.uptime(), unit: "s" }
      }
    }
  });
});
`
    : ""
}
// catch all for unknown routes
app.use((req, res) => {
  res
    .status(404)
    .json({ url: req.originalUrl, message: \`\${req.originalUrl} not found on this server!\` });
});

app.listen(PORT);

console.log(\`${app_name} API server started on: \${PORT}\`);

module.exports = app; // for running tests.
`;

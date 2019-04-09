"use strict";

module.exports = function corsSource(options) {
  return `"use strict";

const cors = require("cors");

// set up cors. This will allow the api to be accessed from domains other than apis domain, i.e.
// other webapps from different domains. By default this is disabled for safety reasons, to prevent
// some third party website from accessing our api without permission.

${options.heroku ? `const herokuAPI = "https://YOUR-HEROKU-APP-NAME-HERE.herokuapp.com";` : ""}
const localSPA = "http://localhost:3000"; // please change port if different

// only the domains in this white list will be allowed to access the server.
const corsWhitelist = [
  "*", // placeholder, get rid of this wild card once you have selected specific domain names below
  ${options.heroku ? "herokuAPI," : ""}
  localSPA
];

const corsOptions = {
  origin: (origin, callback) => {
    // check if given origin is in the whitelist or if it's the api origin itself and only permit
    // those.
    if (corsWhitelist.indexOf(origin) !== -1 || !origin) callback(null, true);
    else callback(new Error("Not allowed by CORS"));
  }
};

module.exports = cors(corsOptions);
    `;
};

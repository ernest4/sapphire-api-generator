"use strict";

module.exports = function allRoutesSource(apiVersion) {
  return `"use strict";

const fs = require('fs');

// import all the routes functions into an array.
// loop over the routes functions and apply them to the given app.

let routesArray = [];

const dir = './api/v${apiVersion}/routes/';

fs.readdirSync(dir).forEach(file => {
  if(file.match(/.routes.js/)){
    if(!file.match(/all.routes.js/)){
      file = file.replace(/.routes.js/, '.routes');
      routesArray.push(require(\`./\${file}\`));
    };
  }
});

module.exports = app => {
  for (const routes of routesArray) routes(app);
};
`;
};

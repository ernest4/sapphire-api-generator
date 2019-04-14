"use strict";

exports.testUtilsSource = () => `"use strict";

// Could have used native http, but it's less readable.
// Could have used request or axios etc, but that's yet another dependency.
// So reusing what is present with chai-http.
const chai = require("chai"); // should matchers etc.
const chaiHttp = require("chai-http"); // request().get() ...
const dotEnv = require("dotenv");
const fs = require("fs");
// make variables available from .env locally
dotEnv.config();

// set up
chai.use(chaiHttp);

exports.getAccessToken = () => {
  // get auth0 token for accessing api
  console.log(\`  Getting access token from Auth0 before running tests:\`);
  return new Promise((resolve, reject) => {
    // try the cached file first
    try {
      const sapphireJSON = fs.readFileSync(\`./tests/integration/temp.json\`);
      const { access_token, create_time, expires_in } = JSON.parse(sapphireJSON);
      const expiration_time = create_time + expires_in * 1000;
      const hours_to_expriation = (expiration_time - create_time) / (3600 * 1000);

      console.log(\`
    GOT CACHED TOKEN: still valid for \${hours_to_expriation} hours
    Created at: \${new Date(create_time)}
    Expires at: \${new Date(expiration_time)}
    \`);

      if (hours_to_expriation < 2) {
        console.log(\`
    WARNING: token will expire soon, generating new one...\`);
        throw new Error("refresh");
      }

      resolve(access_token);
    } catch (err) {
      if (err.message !== "refresh") {
        console.log(\`
    WARNING: No valid cached token found locally, generating new one...\`);
      }
    }

    // the code access_token is either present and the code above resolves or
    // the token is missing / expired and a new one is then generated below.
    chai
      .request(\`https://\${process.env.AUTH0_DOMAIN}\`)
      .post("/oauth/token")
      .set("content-type", "application/json")
      .send({
        grant_type: "client_credentials",
        client_id: process.env.AUTH0_CLIENT_ID,
        client_secret: process.env.AUTH0_CLIENT_SECRET,
        audience: process.env.AUTH0_AUDIENCE
      })
      .end((err, res) => {
        if (err) {
          console.log(\`
          FAILED TO GET ACCESS TOKEN, ABORTING ALL TESTS. POSSIBLE SOLUTIONS:

          1) make sure you have created a test application with
             machine-to-machine (MtM) access in Auth0 dashboard.

          2) check your .env file and make sure AUTH0_DOMAIN, AUTH0_CLIENT_ID,
             AUTH0_CLIENT_SECRET and AUTH0_AUDIENCE are all present and the
             information is correct. 
             
             NOTE: AUTH0_CLIENT_ID and AUTH0_CLIENT_SECRET for the MtM are NOT
             THE SAME as Client ID and Client Secret for your SPA!
          \`);
          reject(new Error(err));
        }

        console.log(\`
    GOT IT! continue with testing...
        \`);

        const { access_token, expires_in } = res.body;
        try {
          const tempJSONPath = \`./tests/integration/temp.json\`;
          const tempObject = {
            access_token: access_token,
            create_time: Date.now(),
            expires_in: expires_in
          };
          fs.writeFileSync(tempJSONPath, JSON.stringify(tempObject, null, 2));
        } catch (err) {
          console.log(\`
    WARNING: Failed to cache token locally...\`);
        }
        resolve(access_token);
      });
  });
};
`;
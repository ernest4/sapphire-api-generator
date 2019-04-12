"use strict";

const capitalize = require("../../../utils/capitalize");

exports.editableTestSource = (asset, options) => `"use strict";

const mongoose = require("mongoose");
const ${capitalize(asset)} = require("../../../../api/v${options.apiv}/models/${asset}/${asset}.model");

//Require the dev-dependencies
const chai = require("chai"); // should matchers etc.
const chaiHttp = require("chai-http"); // request().get() ...
const dotEnv = require("dotenv");
// make variables available from .env locally
dotEnv.config();
const server = require("../../../../server"); // your app

// set up
const should = chai.should();
chai.use(chaiHttp);

// NOTE: using arrow functions as mocha functions is discouraged, thus function() is used!
describe("[CUSTOM TEST] ${capitalize(asset)} asset endpoints\\n", function() {
  this.timeout(10000);


  // UNCOMMENT THE CODE BLOCK BELOW IF YOU WANT ACCESS TO AUTH0 AUTHORIZATION TOKEN

  // let access_token = "";

  // before(function(done) {
  //   // runs before all tests in this block

  //   // get auth0 token for accessing api
  //   console.log(\`
  //   Getting access token from Auth0 before running tests:\`);
  //   chai
  //     .request(\`https://\${process.env.AUTH0_DOMAIN}\`)
  //     .post("/oauth/token")
  //     .set("content-type", "application/json")
  //     .send({
  //       grant_type: "client_credentials",
  //       client_id: process.env.AUTH0_CLIENT_ID,
  //       client_secret: process.env.AUTH0_CLIENT_SECRET,
  //       audience: process.env.AUTH0_AUDIENCE
  //     })
  //     .end((err, res) => {
  //       if (err) {
  //         console.log(\`
  //         FAILED TO GET ACCESS TOKEN, ABORTING ALL TESTS. POSSIBLE SOLUTIONS:

  //         1) make sure you have created a test application with
  //            machine-to-machine (MtM) access in Auth0 dashboard.

  //         2) check your .env file and make sure AUTH0_DOMAIN, AUTH0_CLIENT_ID,
  //            AUTH0_CLIENT_SECRET and AUTH0_AUDIENCE are all present and the
  //            information is correct. 
             
  //            NOTE: AUTH0_CLIENT_ID and AUTH0_CLIENT_SECRET for the MtM are NOT
  //            THE SAME as Client ID and Client Secret for your SPA!
  //         \`);
  //         throw new Error(err);
  //       }

  //       console.log(\`    GOT IT! continue with testing...
  //       \`);
  //       access_token = res.body.access_token;
  //       done();
  //     });
  // });

  beforeEach(function(done) {
    //Before each test empty the database and start clean
    ${capitalize(asset)}.deleteMany({}, err => {
      done();
    });
  });

  describe("<HTTP_VERB_HERE> /${asset}", function() {
    it("it should be your test case here", function() {
      // ... your test
      const dummy_sum = 1+1;
      dummy_sum.should.equal(2);
    });
  });
});
`;

exports.generatedTestSource = (asset, options) => `"use strict";

const mongoose = require("mongoose");
const ${capitalize(asset)} = require("../../../../api/v1/models/${asset}/${asset}.model");

//Require the dev-dependencies
const chai = require("chai"); // should matchers etc.
const chaiHttp = require("chai-http"); // request().get() ...
const dotEnv = require("dotenv");
// make variables available from .env locally
dotEnv.config();
const server = require("../../../../server"); // your app

// set up
const should = chai.should();
chai.use(chaiHttp);

// NOTE: using arrow functions as mocha functions is discouraged, thus function() is used!
describe("[SAPPHIRE TEST] ${capitalize(asset)} asset endpoints\\n", function() {
  this.timeout(10000);

  let access_token = "";

  before(function(done) {
    // runs before all tests in this block

    // get auth0 token for accessing api
    console.log(\`  Getting access token from Auth0 before running tests:\`);
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
          throw new Error(err);
        }

        console.log(\`
    GOT IT! continue with testing...
        \`);
        access_token = res.body.access_token;
        done();
      });
  });

  beforeEach(function(done) {
    //Before each test empty the database and start clean
    ${capitalize(asset)}.deleteMany({}, err => {
      done();
    });
  });

  describe("GET /${asset}", function() {
    it("it should get all the ${capitalize(asset)}", function(done) {
      chai
        .request(server)
        .get("/api/v1/${asset}")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
          res.body.length.should.be.eql(0);
          done();
        });
    });
  });

  // SAPPHIRE TEST CASE GENERATION WIP....

  // describe("POST /${asset}", () => {
  //   it("it should not create a ${capitalize(asset)} without socialId field", done => {
  //     const ${asset} = {
  //       // socialId: "hdshasdsfkdgjfd",
  //       fullName: "testy_name_1 testy_surname_0",
  //       gender: "m",
  //       birthday: Date.now
  //     };
  //     chai
  //       .request(server)
  //       .post("/api/v1/${asset}")
  //       .set("Authorization", \`Bearer \${access_token}\`)
  //       .send(${asset})
  //       .end((err, res) => {
  //         res.should.have.status(200);
  //         // res.body.should.be.a("object");
  //         // res.body.should.have.property("errors");
  //         // res.body.errors.should.have.property("socialId");
  //         // res.body.errors.socialId.should.have.property("kind").eql("required");
  //         done();
  //       });
  //   });
  // });
});
`;

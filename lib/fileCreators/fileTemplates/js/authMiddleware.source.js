"use strict";

exports.authMiddlewareSource = () => `"use strict";
const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");
const dotEnv = require("dotenv");

// make variables available from .env locally
dotEnv.config();

// Authentication middleware. When used, the
// Access Token must exist and be verified against
// the Auth0 JSON Web Key Set
module.exports = jwt({
  // Dynamically provide a signing key
  // based on the kid in the header and
  // the signing keys provided by the JWKS endpoint.
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: \`https://\${process.env.AUTH0_DOMAIN}/.well-known/jwks.json\`
  }),

  // Validate the audience and the issuer.
  audience: process.env.AUTH0_AUDIENCE,
  issuer: \`https://\${process.env.AUTH0_DOMAIN}/\`,
  algorithms: ["RS256"]
});
`;

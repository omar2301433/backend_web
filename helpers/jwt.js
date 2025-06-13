const { expressjwt: jwt } = require("express-jwt");

function authJwt() {
  return jwt({
    secret: process.env.secret,
    algorithms: ["HS256"],
  }).unless({
    path: [
      { url: /\/public\/uploads(.*)/, methods: ['GET', 'OPTIONS'] },
      { url: /\/api\/v1\/product(.*)/, methods: ['GET', 'OPTIONS'] },
      { url: /\/api\/v1\/category(.*)/, methods: ['GET', 'OPTIONS'] },
      { url: /\/api\/v1\/brand(.*)/, methods: ['GET', 'OPTIONS'] },
      "/api/v1/user/login",
      "/api/v1/user/register",
      "/" // 👈 Allow access to localhost:3000/
    ],
  });
}

module.exports = authJwt;

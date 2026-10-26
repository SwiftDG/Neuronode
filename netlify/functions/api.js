const serverless = require("serverless-http");
const app = require("../../backend/main");

exports.handler = serverless(app);

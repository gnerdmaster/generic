const { createTables } = require("@/project/tables");
const ApiGateway = require("@/project/api_gateway");
const { createLambdas } = require("@/project/lambdas");

const CoreStack = (app) => {
  // Create Tables
  const tables = createTables();

  // Create Lambdas
  const lambdas = createLambdas();

  // Create ApiGateway
  ApiGateway(app, lambdas);
};

module.exports = { CoreStack };

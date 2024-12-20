const { createTables } = require("@/project/tables");
const { createLambdas } = require("@/project/lambdas");
const ApiGateway = require("@/project/api_gateway");

const CoreStack = (app) => {
  // Create Tables
  const tables = createTables();

  // Create Lambdas
  const lambdas = createLambdas();

  // Create ApiGateway
  ApiGateway(app, lambdas);
};

module.exports = { CoreStack };

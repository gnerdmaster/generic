const profile_routers = require("@/routes/profiles");
const example_routers = require("@/routes/examples");

const ApiGateway = (app, lamdbas) => {
  const _profile_routers = profile_routers(lamdbas);
  app.use(process.env.DOMAIN_BASEPATH, _profile_routers);
  const _example_routers = example_routers();
  app.use(process.env.DOMAIN_BASEPATH, _example_routers);
};

module.exports = ApiGateway;

const profile_routers = require("@/routes/profiles");

const ApiGateway = (app, lamdbas) => {
  const _profile_routers = profile_routers(lamdbas);
  app.use(process.env.DOMAIN_BASEPATH, _profile_routers);
};

module.exports = ApiGateway;

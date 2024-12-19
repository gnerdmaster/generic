const profile_routers = require("@/routes/profiles");

const ApiGateway = (app, lamdbas) => {
  app.use(profile_routers(lamdbas));
};

module.exports = ApiGateway;

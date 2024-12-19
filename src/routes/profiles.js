const express = require("express");
const router = express.Router();

const { routerMixin } = require("@/system/router_mixin");
const { createRouter } = routerMixin(router);

const routers = (lambdas) => {
  createRouter("GET", "/profiles", lambdas.profiles);

  createRouter("GET", "/profiles/:profileId", lambdas.profiles);

  createRouter("PUT", "/profiles/:profileId", lambdas.profiles);

  createRouter("DELETE", "/profiles/:profileId", lambdas.profiles);

  createRouter("POST", "/profiles/_create", lambdas.profiles);

  createRouter("POST", "/profiles/_search", lambdas.profiles);

  createRouter("POST", "/profiles/:profileId/_update", lambdas.profiles);

  createRouter("POST", "/profiles/:profileId/_delete", lambdas.profiles);

  return router;
};

module.exports = routers;

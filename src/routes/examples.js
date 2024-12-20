const express = require("express");
const router = express.Router();

const { routerMixin } = require("@/system/router_mixin");
const { createRouter } = routerMixin(router);

const routers = (lambdas) => {
  router.get("/", (req, res) => {
    res.json({ message: "Hello World!" });
  });

  router.get("/welcome", (req, res) => {
    res.json({ message: "Welcome to the ipromos API!" });
  });

  return router;
};

module.exports = routers;

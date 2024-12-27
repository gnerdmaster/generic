const { Router } = require("express");

const { loggerMiddleware, sendResponseMiddleware } = require("./middlewares");
const middlewares = require("./middlewares");
/**
 * Pre-carga la creación de rutas, para configuraciones personalizadas.
 * - loggerMiddleware - Middleware de logs personalizados
 * - sendResponseMiddleware - Middleware de respuesta personalizado
 * @param {Router} router - Router
 */
const routerMixin = (router) => {
  /***
   * Create a route
   * @param {string} method - Method
   * @param {string} route - Router Path
   * @param {object} _lambda - Lambda Object
   */
  const createRouter = (method, route, _lambda) => {
    const {
      [_lambda.function_handler]: function_handler,
    } = require(_lambda.file_handler_path);
    const middlewares = [
      loggerMiddleware,
      async (req, res, next) => {
        const result = await function_handler(req, res);
        sendResponseMiddleware(
          req,
          res,
          next,
          result.response,
          result.status_code
        );
      },
    ];

    router[method.toLowerCase()](route, [...middlewares]);
  };

  return { createRouter };
};

module.exports = { routerMixin };

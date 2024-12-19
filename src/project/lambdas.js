const { _lambda } = require("@/system/lamdas");

const basename = "generic";

let lambdas = {};

const create_function = (function_name, environtment = {}, config = {}) => {
  const function_lambda = _lambda(
    `${basename}-${function_name}`,
    "profiles",
    {
      file: "@/lambdas/" + function_name,
    },
    "handler.function_handler",
    environtment
  );

  return function_lambda;
};
createLambdas = () => {
  lambdas.profiles = create_function("profiles");

  return lambdas;
};

module.exports = { createLambdas };

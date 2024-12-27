const getEnvironment = (default_environment) => {
  const environment = process.env.SERVER_ENVIRONMENT || default_environment;
  const config = require("./config");
  const data = require("./package.json");

  const app_data = {
    APP_NAME: data.name,
    VERSION: data.version,
    AUTHOR: data.author,
  };

  const environment_data = ["dev", "qa", "prod"].includes(environment)
    ? config[environment]
    : {};

  process.env = { ...process.env, ...app_data, ...environment_data };
};

getEnvironment("dev");

require("./aliases");

//llama a /src/index que ejecuta todo lo demás
require("./src/index");

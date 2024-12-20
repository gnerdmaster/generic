const environment_server = require("./config_server");
const getEnvironment = (env) => {
  const config = require("./config");
  const data = require("./package.json");

  const app_data = {
    APP_NAME: data.name,
    VERSION: data.version,
    AUTHOR: data.author,
  };

  const environment = ["dev", "qa", "prod"].includes(env) ? config[env] : {};

  console.log(environment);

  process.env = { ...process.env, ...app_data, ...environment };
};

getEnvironment(environment_server.ENVIRONMENT);

require("./aliases");

//llama a /src/index que ejecuta todo lo demás
require("./src/index");

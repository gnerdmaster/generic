// process.env.SERVER_ENVIRONMENT = "dev";
// process.env.SERVER_DOMAIN_BASEPATH = "/api";
// process.env.SERVER_DB_MARIADB_HOST = "localhost";
// process.env.SERVER_DB_MARIADB_USER = "root";
// process.env.SERVER_DB_MARIADB_PASSWORD = "";
// process.env.SERVER_DB_MARIADB_DBNAME = "generic";
// process.env.SERVER_DB_MARIADB_PORT = "3306";

const getEnvironment = (env) => {
  const config = require("./config");
  const data = require("./package.json");

  const app_data = {
    APP_NAME: data.name,
    VERSION: data.version,
    AUTHOR: data.author,
  };

  const environment = ["dev", "qa", "prod"].includes(env) ? config[env] : {};

  process.env = { ...process.env, ...app_data, ...environment };
};

const environment = process.env.SERVER_ENVIRONMENT;
getEnvironment(environment);

require("./aliases");

//llama a /src/index que ejecuta todo lo demás
require("./src/index");

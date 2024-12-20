const { config } = require("nodemon");
const config_server = require("./config_server");

module.exports = {
  dev: {
    DOMAIN_BASEPATH: "/api",
    DB_MARIADB_HOST: "localhost",
    DB_MARIADB_USER: "root",
    DB_MARIADB_PASSWORD: "",
    DB_MARIADB_DBNAME: "generic",
    DB_MARIADB_PORT: "3306",
  },
  prod: {
    DOMAIN_BASEPATH: config_server.DOMAIN_BASEPATH,
    DB_MARIADB_HOST: config_server.DB_MARIADB_DBNAME,
    DB_MARIADB_USER: config_server.DB_MARIADB_USER,
    DB_MARIADB_PASSWORD: config_server.DB_MARIADB_PASSWORD,
    DB_MARIADB_DBNAME: config_server.DB_MARIADB_DBNAME,
    DB_MARIADB_PORT: config_server.DB_MARIADB_PORT,
  },
};

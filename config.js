const { config } = require("nodemon");

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
    DOMAIN_BASEPATH: process.env.SERVER_DOMAIN_BASEPATH,
    DB_MARIADB_HOST: process.env.SERVER_DB_MARIADB_HOST,
    DB_MARIADB_USER: process.env.SERVER_DB_MARIADB_USER,
    DB_MARIADB_PASSWORD: process.env.SERVER_DB_MARIADB_PASSWORD,
    DB_MARIADB_DBNAME: process.env.SERVER_DB_MARIADB_DBNAME,
    DB_MARIADB_PORT: process.env.SERVER_DB_MARIADB_PORT,
  },
};

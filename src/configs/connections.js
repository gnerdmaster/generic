const mysql2 = require("mysql2");

const DB_MARIADB_CONNECTION = mysql2.createConnection({
  host: process.env.DB_MARIADB_HOST,
  user: process.env.DB_MARIADB_USER,
  password: process.env.DB_MARIADB_PASSWORD,
  database: process.env.DB_MARIADB_DBNAME,
  port: process.env.DB_MARIADB_PORT,
});

module.exports = {
  DB_MARIADB_CONNECTION,
};

//Prueba de conección

DB_MARIADB_CONNECTION.connect((err) => {
  if (err) {
    console.log("Error de conexión a Base de Datos " + err);
  } else {
    console.log("Conexión de Base de Datos establecida.");
  }
});

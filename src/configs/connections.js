const mysql2 = require("mysql2");

const {
  DB_HOST,
  DB_USER,
  DB_PASSWORD,
  DB_DATABASE,
  DB_PORT,
} = require("./credentials");

const DB_CONNECTION = mysql2.createConnection({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  port: DB_PORT,
});

module.exports = {
  DB_CONNECTION,
};

//Prueba de conección

DB_CONNECTION.connect((err) => {
  if (err) {
    console.log("Error de conexión a Base de Datos " + err);
  } else {
    console.log("Conexión de Base de Datos establecida.");
  }
});

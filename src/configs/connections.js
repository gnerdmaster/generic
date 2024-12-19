const mysql2 = require("mysql2");

const { DB_MYSQL } = require("./credentials");

const DB_CONNECTION = mysql2.createConnection(DB_MYSQL);

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

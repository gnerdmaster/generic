const mysql2 = require("mysql2");

let DB_MARIADB_CONNECTION = mysql2.createConnection({
  host: process.env.DB_MARIADB_HOST,
  user: process.env.DB_MARIADB_USER,
  password: process.env.DB_MARIADB_PASSWORD,
  port: process.env.DB_MARIADB_PORT,
});

DB_MARIADB_CONNECTION.connect((err) => {
  if (err) {
    console.log("Error de conexión a Base de Datos " + err);
  } else {
    console.log("Conexión de Base de Datos establecida.");
  }
});

//Prueba de conexión
DB_MARIADB_CONNECTION.execute(
  `CREATE DATABASE IF NOT EXISTS ${process.env.DB_MARIADB_DBNAME}`,
  (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log(
        `>>> Database ${process.env.DB_MARIADB_DBNAME} created or exists already.`
      );
    }
  }
);

DB_MARIADB_CONNECTION.changeUser(
  {
    database: process.env.DB_MARIADB_DBNAME,
  },
  () => {}
);
console.log(`Database ${process.env.DB_MARIADB_DBNAME} selected`);

module.exports = {
  DB_MARIADB_CONNECTION,
};

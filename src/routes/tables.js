const uuid = require("uuid");
const { Router } = require("express");

const { DB_CONNECTION } = require("../configs/connections");

const router = Router();

router.get("/table/create", (req, res) => {
  const table_name = req.body.name;
  const hash = req.body.hash;
  let sort = "";

  if (req.body.sort !== undefined) {
    sort = req.body.sort;
    sort = `, ${sort} VARCHAR(255) NOT NULL`;
  }

  const query = `CREATE TABLE IF NOT EXISTS ${table_name} (value JSON, ${hash} VARCHAR(255) PRIMARY KEY NOT NULL ${sort});`;

  DB_CONNECTION.query(query, (err, result) => {
    if (err) {
      const response = {
        success: false,
        error: "Error al hacer la consulta: " + err,
      };
      res.status(500).json(response);
    } else {
      const response = {
        success: true,
        message: "¡Consulta exitosa!",
        data: result,
      };
      res.json(response);
    }
  });
});

module.exports = router;

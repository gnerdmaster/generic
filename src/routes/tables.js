/***
 * Pending to design:
 * - Create table (done)
 * - Drop table
 * - Alter table
 * - Rename table
 * - Add sort column with index additionally
 * - Migrate table
 * - Backup database, table or items
 */

const uuid = require("uuid");
const { Router } = require("express");

const { DB_CONNECTION } = require("../configs/connections");

const router = Router();

const Function = {
  executeQuery: async function (query, param_values = []) {
    return new Promise((resolve, reject) => {
      DB_CONNECTION.execute(query, param_values, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  },
};

router.post("/tables/new", async (req, res) => {
  let { body, params } = req;

  const table_name = body.name.replace(/[^a-zA-Z0-9_-]+/g, "_").toLowerCase();
  let hash = body.hash;
  let sort = "";
  let sort_index = "";

  if (body.hash && body.hash !== null && body.hash !== "") {
    hash = hash.toLowerCase();
  } else {
    hash = "id";
  }

  if (body.sort) {
    sort = body.sort.toLowerCase();
    sort_index = `, INDEX idx_${table_name}_${sort}(${sort})`;
    sort = `${sort} VARCHAR(250),`;
  }

  const query = `CREATE TABLE ${table_name} (${hash} varchar(250) PRIMARY KEY,${sort}value longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(value)), status varchar(100)${sort_index}) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci`;

  console.log(query);
  try {
    const query_result = await Function.executeQuery(query);

    const response = {
      success: true,
      message: "¡Creación de la tabla exitosa!",
      data: query_result,
    };
    res.json(response);
  } catch (err) {
    if (err.code === "ER_TABLE_EXISTS_ERROR") {
      const response = {
        success: false,
        error: `La tabla ${table_name} ya existe`,
      };
      res.status(400).json(response);
    } else {
      const response = {
        success: false,
        error: "Error al crear la tabla: " + err,
      };
      res.status(500).json(response);
    }
  }
});

module.exports = router;

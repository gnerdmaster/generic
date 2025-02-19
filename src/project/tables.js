const { Function } = require("@/system/tools");

let tables = {};
/**
 * Crear tabla si no existe
 * @param {string} table_name - Nombre de la tabla
 * @param {string} primary_key - Nombre de la Clave primaria
 * @param {string} sort_key - Nombre de la Clave secundaria
 * @returns {object} - Query result
 */
const createTable = async (table_name, primary_key, sort_key = null) => {
  try {
    let sk_code = {
      field: "",
      index: "",
    };
    if (sort_key) {
      sk_code = {
        field: `\`${sort_key}\` varchar(250) NOT NULL,`,
        index: `, KEY \`idx_${table_name}_${sort_key}\`(\`${sort_key}\`)`,
      };
    }
    const query = `CREATE TABLE \`${table_name}\` (
    \`${primary_key}\` varchar(250) NOT NULL,${sk_code.field}
    \`value\` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(\`value\`)),
    PRIMARY KEY (\`${primary_key}\`)${sk_code.index}
) ENGINE = InnoDB DEFAULT CHARSET = utf8 COLLATE = utf8_general_ci`;

    const result = await Function.executeQuery(query);
    console.log(result);

    console.log(
      `>>> Tabla creada: ${table_name} con PK: ${primary_key}, SK: ${sort_key}`
    );

    return {
      table_name,
      primary_key,
      sort_key,
    };
  } catch (err) {
    if (err.code != "ER_TABLE_EXISTS_ERROR") {
      console.log(err);
    }
    // else {
    //   console.log(`La tabla ${table_name} ya existe`);
    // }
  }
};

const createTables = async () => {
  tables.profiles = await createTable("profiles", "profileId");
  tables.pv_products = await createTable("pv_products", "productId");

  return tables;
};

module.exports = { createTables };

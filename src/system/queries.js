const uuid = require("uuid");
const { format } = require("mysql2");

const { Function } = require("./tools");
const { Operator } = require("./enums");

/***
 * Get item by id (Intern Method). If not found, return {}
 * @param {string} table_name - Table name
 * @param {string} id - Item ID
 * @returns {object} - Item found.
 */
const _getItemById = async (table_name, id = null, value_field_only = true) => {
  let response = {};
  try {
    const query = `SELECT * FROM ${table_name} WHERE id = ?`;
    const params = [id];
    const result = await Function.executeQuery(query, params);
    if (Array.isArray(result) && result.length > 0) {
      if (value_field_only) {
        response = JSON.parse(result[0].value);
      } else {
        response = result[0];
      }
    }
  } catch (err) {
    console.error("Error al obtener el item:", err);
  }

  return response;
};

/***
 * Get all items
 * @param {object} req - Request object
 * @param {object} res - Response object
 * @param {string} table_name - Table name
 * @returns {Array} - Items found or error.
 */
const getAllItems = async (table_name) => {
  let response = {};
  let status_code = 200;

  try {
    const query = `SELECT * FROM ${table_name}`;

    let result = await Function.executeQuery(query);
    if (Array.isArray(result) && result.length > 0) {
      result = result.map((item) => JSON.parse(item.value));
    }

    response = {
      success: true,
      message: "¡Consulta exitosa!",
      data: result,
    };
  } catch (err) {
    response = {
      success: false,
      error: "Error al obtener los items: " + err,
      data: [],
    };
    status_code = 500;
  }

  return { response, status_code };
};

/***
 * Get items by search.
 * @param {object} body - Request body
 * @param {string} table_name - Table name
 * @returns {object} - Response and status code.
 */
const searchItems = async (body, table_name) => {
  let response = {};
  let status_code = 200;

  try {
    let param_values = [];

    const param_keys = Object.keys(body).map((key) => {
      const operator = Function.getOperator(body[key]);
      const value = Function.formatValueByOperator(body[key], operator);

      let parameter_symbol = "";
      if (value !== null) {
        param_values.push(value);

        if (operator === Operator.IN) {
          parameter_symbol = `(?)`;
        } else {
          parameter_symbol = `?`;
        }
      }

      query_lote = `LOWER(TRIM(BOTH '"' FROM JSON_EXTRACT(value, '$.${key}'))) ${operator} ${parameter_symbol}`;

      return query_lote;
    });

    let where = "";
    if (param_keys.length > 0) {
      where = `WHERE ${param_keys.join(" AND ")}`;
    }

    let query = `SELECT * FROM ${table_name} ${where}`;

    query = format(query, param_values);
    console.log(query);
    let result = await Function.executeQuery(query);

    if (Array.isArray(result) && result.length > 0) {
      for (let i = 0; i < result.length; i++) {
        result[i] = JSON.parse(result[i].value);
      }
    }

    response = {
      success: true,
      message: "¡Consulta exitosa!",
      data: result,
    };
  } catch (err) {
    response = {
      success: false,
      error: "Error al obtener los items: " + err,
      data: [],
    };
    status_code = 500;
  }

  return { response, status_code };
};

/***
 * Get item by id. If not found, return {}
 * @param {object} body - Request body
 * @param {string} table_name - Table name
 * @returns {object} - Response and status_code.
 */
const getItemById = async (body, table_name) => {
  let response = {};
  let status_code = 200;

  try {
    const item = await _getItemById(table_name, body.id);

    if (typeof item === "object") {
      response = {
        success: true,
        message: "¡Consulta exitosa!",
        data: item,
      };
    } else {
      response = {
        success: false,
        error: "No se encontró item con el ID proporcionado",
        data: {},
      };
      status_code = 404;
    }
  } catch (err) {
    const response = {
      success: false,
      error: "Error al obtener el item: " + err,
      data: {},
    };
    status_code = 500;
  }

  return { response, status_code };
};

/***
 * Save item
 * @param {object} body - Request body
 * @param {string} table_name - Table name
 * @returns {object} - Response and status code.
 */
const saveItem = async (body, table_name) => {
  let response = {};
  let status_code = 200;

  try {
    const old_item = await _getItemById(table_name, body.id);

    if (old_item.id) {
      response = {
        success: false,
        error: "Ya existe un item con el ID proporcionado",
        data: old_item,
      };
      status_code = 406;
    } else {
      const id = uuid.v4();
      const item = { id, ...body };
      const query = `INSERT INTO ${table_name} (id, value) VALUES (?, ?)`;
      const params = [item.id, JSON.stringify(item)];
      const result_query = await Function.executeQuery(query, params);

      response = {
        success: true,
        message: "¡Registro exitoso!",
        data: item,
      };
    }
  } catch (err) {
    response = {
      success: false,
      error: "Error al guardar el registro: " + err,
      data: {},
    };

    status_code = 500;
  }

  return { response, status_code };
};

/***
 * Update item
 * @param {object} body - Request body
 * @param {string} table_name - Table name
 * @returns {object} - Response and status code.
 */
const updateItem = async (body, table_name) => {
  let response = {};
  let status_code = 200;

  try {
    const query = `UPDATE ${table_name} SET value = JSON_MERGE_PATCH(value, ?) WHERE id = ?`;
    const query_params = [JSON.stringify(body), body.id];
    const result_query = await Function.executeQuery(query, query_params);

    const item = await _getItemById(table_name, body.id);

    if (result_query.affectedRows > 0) {
      response = {
        success: true,
        message: "¡Actualización exitosa!",
        data: item,
      };
    } else {
      response = {
        success: false,
        error: "No se encontró ningún item con el ID proporcionado",
      };
      status_code = 404;
    }
  } catch (err) {
    response = {
      success: false,
      error: "Error en la actualización: " + err,
    };
    status_code = 500;
  }

  return { response, status_code };
};

/***
 * Delete item, firth move to trash, else delete
 * @param {object} body - Request body
 * @param {string} table_name - Table name
 * @returns {object} - Response and status code.
 */
const deleteItem = async (body, table_name) => {
  let response = {};
  let status_code = 200;

  try {
    let item = await _getItemById(table_name, body.id, false);

    let result_query = {};
    const query = `DELETE FROM ${table_name} WHERE id = ?`;
    const params = [body.id];

    result_query = await Function.executeQuery(query, params);

    if (result_query.affectedRows === 0) {
      response = {
        success: false,
        error: "No se encontró ningún item con el ID proporcionado",
      };
      status_code = 404;
    } else {
      response = {
        success: true,
        message: "¡Eliminación exitosa!",
        data: JSON.parse(item.value),
      };
    }
  } catch (err) {
    response = {
      success: false,
      error: "Error en la eliminación: " + err,
    };
    status_code = 500;
  }

  return { response, status_code };
};

/***
 * Call stored procedure
 * @param {object} req - Request object
 * @param {object} res - Response object
 * @param {string} stored_procedure_name - Stored procedure name
 * @param {Array} parameters - Stored procedure parameters. Example:
 * ```javascript
 * {
 *  id: { type: "int", value: 123 },
 *  nombre: { type: "varchar", value: "hola" },
 *  fecha: { type: "date", value: "2022-01-01" },
 *  datos: { type: "json", value: { foo: "bar" } },
 *  ...
 * }
 * ```
 * @returns {object} - Stored procedure result or error.
 */
const callStoredProcedure = async (
  req,
  res,
  stored_procedure_name,
  parameters
) => {
  try {
    // const parameters = {
    //   id: { type: "int", value: 123 },
    //   nombre: { type: "varchar", value: "hola" },
    //   fecha: { type: "date", value: "2022-01-01" },
    //   datos: { type: "json", value: { foo: "bar" } },
    //   // ...
    // };

    // const typeConverters = {
    //   int: (value) => value,
    //   float: (value) => value,
    //   bigint: (value) => value,
    //   varchar: (value) => `'${value}'`,
    //   text: (value) => `'${value}'`,
    //   enum: (value) => `'${value}'`,
    //   set: (value) => `'${value}'`,
    //   date: (value) => `'${value}'`,
    //   datetime: (value) => `'${value}'`,
    //   boolean: (value) => (value ? 1 : 0),
    //   null: (value) => "NULL",
    //   json: (value) => `'${JSON.stringify(value)}'`,
    //   blob: (value) => `'${value.toString("hex")}'`,
    // };

    // const query = `CALL ${stored_procedure_name}(${Object.keys(parameters)
    //   .map((key) => {
    //     const param = parameters[key];
    //     const converter = typeConverters[param.type];
    //     if (!converter) {
    //       throw new Error(`Tipo de dato desconocido: ${param.type}`);
    //     }
    //     return converter(param.value);
    //   })
    //   .join(",")})`;

    // const result_by_query = await new Promise((resolve, reject) => {
    //   DB_CONNECTION.query(query, (err, result) => {
    //     if (err) {
    //       reject(err);
    //     } else {
    //       resolve(result);
    //     }
    //   });
    // });

    const num_params = Object.keys(parameters).length;
    const params = [...Object.values(parameters)];
    let query = `CALL ${stored_procedure_name} (${Array(num_params)
      .fill("?")
      .join(",")})`;

    query = format(query, params);
    console.log(query);

    const result = await Function.executeQuery(query);

    const response = {
      success: true,
      message: "¡Consulta exitosa!",
      data: result,
    };
    res.json(response);
  } catch (err) {
    const response = {
      success: false,
      error: "Error al hacer la consulta: " + err,
    };
    res.status(500).json(response);
  }
};

module.exports = {
  getAllItems,
  searchItems,
  getItemById,
  saveItem,
  updateItem,
  deleteItem,
};

const { DB_MARIADB_CONNECTION } = require("@/configs/connections");

/***
 * Send response.
 * @param {object} req - Request object
 * @param {object} res - Response object
 * @param {object} response - Response object
 * @param {number} status_code - Status code
 */
const sendResponse = (req, res, response, status_code) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  if (response.success) {
    res.json(response);
  } else {
    res.status(status_code).json(response);
  }
};

const Function = {
  /***
   * Execute query
   * @param {string} query - Query
   * @param {Array} param_values - Query parameters
   * @returns {object} - Query result
   */
  executeQuery: async function (query, param_values = []) {
    return new Promise((resolve, reject) => {
      DB_MARIADB_CONNECTION.execute(query, param_values, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  },
  /***
   * Get operator
   * @param {object} value - Value
   * @returns {string} - Operator
   */
  getOperator: function (value) {
    if (
      typeof value === "object" &&
      value.operator &&
      value.operator.toUpperCase() in Operator
    ) {
      return Operator[value.operator.toUpperCase()];
    }
    return "=";
  },
  /***
   * Get parameter value.
   * @param {object} value - Value
   * @param {string} operator - Operator
   * @returns {string} - Parameter value
   */
  formatValueByOperator: function (value, operator = "=") {
    let new_value = value;
    if (typeof value === "object") {
      if ([Operator.LIKE, Operator["NOT LIKE"]].includes(operator)) {
        new_value = `%${value.value ? value.value : ""}%`;
      } else if (
        [Operator["IS NULL"], Operator["IS NOT NULL"]].includes(operator)
      ) {
        new_value = null;
      } else {
        new_value = value.value;
      }
    }

    if (typeof new_value === "string") {
      return new_value.trim().toLowerCase();
    }
    return new_value;
  },
};

module.exports = { sendResponse, Function };

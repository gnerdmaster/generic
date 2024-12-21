const { DB_MARIADB_CONNECTION } = require("@/configs/connections");
const mariadb_error_type = require("./mariadb_error_type");

class Model {
  constructor(tableName) {
    this.tableName = tableName;
    this.db_client = DB_MARIADB_CONNECTION;
  }

  async executeQuery(query, param_values = [], defaultValue = []) {
    let result = defaultValue;
    try {
      result = await new Promise((resolve, reject) => {
        this.db_client.execute(query, param_values, (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      });

      // result = typeof defaultValue == "boolean" ? true : result;
    } catch (err) {
      // console.error(err);
      result = err;
      // result = typeof defaultValue == "boolean" ? false : result;
    }

    return result;
  }

  async getIndexes() {
    let indexes = await this.executeQuery(`SHOW INDEX FROM ${this.tableName}`);

    if (indexes.length > 0) {
      indexes = indexes.map((index) => index.Column_name);
    }

    return indexes;
  }

  async get(key) {
    let query = `SELECT * FROM ${this.tableName} WHERE `;
    let values = [];

    for (const field of Object.keys(key)) {
      query += `${field} = ? AND `;
      values.push(key[field]);
    }

    query = query.slice(0, -5); // eliminar el último " AND "

    let result = await this.executeQuery(query, values);

    if (result.length > 0) {
      result = JSON.parse(result[0].value);
    }

    return result;
  }

  async getAll() {
    let result = await this.executeQuery(`SELECT * FROM ${this.tableName}`);

    if (result.length > 0) {
      result = result.map((item) => JSON.parse(item.value));
    }

    return result;
  }

  async save(data) {
    let indexes = await this.getIndexes();
    const index_columns = indexes.join(", ");
    let index_params = Array(indexes.length).fill("?").join(", ");
    let index_values = indexes.map((index) => data[index]);

    let query = `INSERT INTO <#TABLE_NAME#> (<#INDEX_COLUMNS#>, value) VALUES (<#INDEX_PARAMS#>, ?)`;

    for (const replace of [
      { "<#TABLE_NAME#>": this.tableName },
      { "<#INDEX_COLUMNS#>": index_columns },
      { "<#INDEX_PARAMS#>": index_params },
    ]) {
      for (const [key, value] of Object.entries(replace)) {
        query = query.replace(key, value);
      }
    }

    const params = [...index_values, JSON.stringify(data)];
    let response = await this.executeQuery(query, params, false);
    let error = {};

    console.log("save - result", response);
    if (response.affectedRows > 0) {
      response = true;
    } else {
      error = {
        errno: response.errno,
        code: response.code,
        sqlMessage: response.sqlMessage,
        message:
          response.code in mariadb_error_type
            ? mariadb_error_type[response.code]
            : response.sqlMessage,
      };

      response = false;
    }

    return { response, error };
  }

  async update(key, data) {
    let indexes = await this.getIndexes();
    const index_columns = indexes.join(", ");
    let index_params = Array(indexes.length).fill("?").join(", ");
    let index_values = indexes.map((index) => key[index]);

    let query = `UPDATE <#TABLE_NAME#> SET value = ? WHERE <#INDEX_COLUMNS#> = <#INDEX_PARAMS#>`;

    for (const replace of [
      { "<#TABLE_NAME#>": this.tableName },
      { "<#INDEX_COLUMNS#>": index_columns },
      { "<#INDEX_PARAMS#>": index_params },
    ]) {
      for (const [key, value] of Object.entries(replace)) {
        query = query.replace(key, value);
      }
    }

    const params = [JSON.stringify(data), ...index_values];
    let response = await this.executeQuery(query, params, false);
    let error = {};

    console.log("update - result", response);
    if (response.affectedRows > 0) {
      response = true;
    } else {
      error = {
        errno: response.errno,
        code: response.code,
        sqlMessage: response.sqlMessage,
        message:
          error.code in mariadb_error_type
            ? mariadb_error_type[error.code]
            : response.sqlMessage,
      };

      response = false;
    }

    return { response, error };
  }

  async delete(key) {
    let query = `DELETE FROM ${this.tableName} WHERE `;
    let values = [];

    for (const field of Object.keys(key)) {
      query += `${field} = ? AND `;
      values.push(key[field]);
    }

    query = query.slice(0, -5); // eliminar el último " AND "

    await this.db_client.execute(query, values, (err, results) => {
      if (err) {
        console.error(err);
      } else {
        console.log(results);
      }
    });
  }
}

module.exports = Model;

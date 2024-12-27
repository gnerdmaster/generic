const { DB_MARIADB_CONNECTION } = require("@/configs/connections");
const mariadb_error_type = require("./mariadb_error_type");

class Model {
  constructor(tableName) {
    this.tableName = tableName;
    this.db_client = DB_MARIADB_CONNECTION;
    this.indexes = this.getIndexes();
  }

  buildError(response) {
    return {
      response: false,
      error: {
        errno: response.errno,
        code: response.code,
        sqlMessage: response.sqlMessage,
        message:
          response.code in mariadb_error_type
            ? mariadb_error_type[response.code]
            : response.sqlMessage,
      },
    };
  }

  async executeQuery(query, param_values = []) {
    let result = null;
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
    } catch (err) {
      result = err;
    }

    return result;
  }

  async getIndexes() {
    const response = await this.executeQuery(
      `SHOW INDEX FROM ${this.tableName}`
    );

    const indexes = Array.isArray(response)
      ? response.map((index) => index.Column_name)
      : [];

    return indexes;
  }

  async get(key) {
    let query = `SELECT * FROM ${this.tableName} WHERE `;
    let param_values = [];

    for (const field of Object.keys(key)) {
      query += `${field} = ? AND `;
      param_values.push(key[field]);
    }

    query = query.slice(0, -5); // eliminar el último " AND "

    let response = await this.executeQuery(query, param_values);

    if (Array.isArray(response)) {
      response = response.length > 0 ? JSON.parse(response[0].value) : {};
      return { response };
    } else {
      //It is not an array then it's an error
      return { ...this.buildError(response) };
    }
  }

  async getAll() {
    let response = await this.executeQuery(`SELECT * FROM ${this.tableName}`);

    if (Array.isArray(response)) {
      response =
        response.length > 0
          ? response.map((item) => JSON.parse(item.value))
          : [];
      return { response };
    } else {
      //It is not an array then it's an error
      return { ...this.buildError(response) };
    }
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
    let response = await this.executeQuery(query, params);

    if (response.affectedRows > 0) {
      return { response: true };
    } else {
      return { ...this.buildError(response) };
    }
  }

  async update(key, data) {
    const query = `UPDATE ${table_name} SET value = JSON_MERGE_PATCH(value, ?) WHERE `;
    let index_params = [];

    for (const field of Object.keys(key)) {
      query += `${field} = ? AND `;
      index_params.push(key[field]);
    }

    query = query.slice(0, -5); // eliminar el último " AND "
    console.log("update_query", query);

    const param_values = [JSON.stringify(data), ...index_params];
    let response = await this.executeQuery(query, param_values);

    if (response.affectedRows > 0) {
      return { response: true };
    } else {
      return { ...this.buildError(response) };
    }
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

  async query(query) {
    let response = await this.executeQuery(query);
    return response;
  }
}

module.exports = Model;

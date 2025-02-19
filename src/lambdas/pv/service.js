const {
  getAllItems,
  searchItems,
  getItemById,
  saveItem,
  updateItem,
  deleteItem,
} = require("@/system/queries");
const { ok, conflict, internal_server_error } = require("@/system/http_utils");
const DBProfiles = require("./db_profiles");

const db_profiles = new DBProfiles();

class Service {
  constructor(body, method) {
    this.body = body;
    this.method = method;
  }

  async process() {
    let result = {};
    const { body, method } = this;
    if (method === "CREATE") {
      const { response, error } = await db_profiles.save(body);
      if (!error) {
        result = ok("Registro exitoso", response);
      } else {
        result = conflict(error.message);
      }
    } else if (method === "GET_ALL") {
      const { response, error } = await db_profiles.getAll();
      if (!error) {
        result = ok("Consulta exitosa", response);
      } else {
        result = internal_server_error(error.message);
      }
    } else if (method === "SEARCH") {
      const { response, error } = await db_profiles.query(body);
      if (!error) {
        result = ok("Consulta exitosa", response);
      } else {
        result = internal_server_error(error.message);
      }
    } else if (method === "GET_BY_ID") {
      const { response, error } = await db_profiles.get({
        profileId: body.profileId,
      });
      if (!error) {
        result = ok("Consulta exitosa", response);
      } else {
        result = internal_server_error(error.message);
      }
    } else if (method === "UPDATE") {
      const { response, error } = await db_profiles.update(body);
      if (!error) {
        result = ok("Actualización exitosa", response);
      } else {
        result = internal_server_error(error.message);
      }
    } else if (method === "DELETE") {
      const { response, error } = await db_profiles.delete(body);
      if (!error) {
        result = ok("Eliminación exitosa", response);
      } else {
        result = internal_server_error(error.message);
      }
    }

    return result;
  }
}

module.exports = Service;

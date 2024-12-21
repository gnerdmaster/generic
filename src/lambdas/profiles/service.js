const {
  getAllItems,
  searchItems,
  getItemById,
  saveItem,
  updateItem,
  deleteItem,
} = require("@/system/queries");
const { ok, conflict } = require("@/system/http_utils");
const DBProfiles = require("./db_profiles");

const db_profiles = new DBProfiles();

const TABLE_NAME = "profiles";

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
      if (response) {
        result = ok("Registro exitoso", response);
      } else {
        result = conflict(error.message);
      }
    } else if (method === "GET_ALL") {
      const response = await db_profiles.getAll();
      result = ok("Consulta exitosa", response);
    } else if (method === "SEARCH") {
      result = await searchItems(body, TABLE_NAME);
    } else if (method === "GET_BY_ID") {
      const response = await db_profiles.get({ profileId: body.profileId });
      result = ok("Consulta exitosa", response);
    } else if (method === "UPDATE") {
      result = await updateItem(body, TABLE_NAME);
    } else if (method === "DELETE") {
      result = deleteItem(body, TABLE_NAME);
    }

    return result;
  }
}

module.exports = Service;

const {
  getAllItems,
  searchItems,
  getItemById,
  saveItem,
  updateItem,
  deleteItem,
} = require("@/system/queries");

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
      result = await saveItem(body, TABLE_NAME);
      console.log(result);
    } else if (method === "GET_ALL") {
      result = await getAllItems(TABLE_NAME);
    } else if (method === "SEARCH") {
      result = await searchItems(body, TABLE_NAME);
    } else if (method === "GET_BY_ID") {
      result = await getItemById(body, TABLE_NAME);
    } else if (method === "UPDATE") {
      result = await updateItem(body, TABLE_NAME);
    } else if (method === "DELETE") {
      result = deleteItem(body, TABLE_NAME);
    }

    return result;
  }
}

module.exports = Service;

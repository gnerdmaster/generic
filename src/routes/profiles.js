const { Router } = require("express");
const router = Router();

const { DB_CONNECTION } = require("../configs/connections");
const {
  getAllItems,
  searchItems,
  getItemById,
  saveItem,
  updateItem,
  deleteItem,
  _sendResponse,
} = require("./functions/queries");

const TABLE_NAME = "profiles";

const routerFunctions = {
  search: async function (req, res) {
    let { body, params } = req;

    const { response, status_code } = await searchItems(body, TABLE_NAME);
    _sendResponse(req, res, response, status_code);
  },
  get: async function (req, res, typeGet = "all") {
    if (typeGet === "all") {
      const { response, status_code } = await getAllItems(TABLE_NAME);
      _sendResponse(req, res, response, status_code);
    } else if (typeGet === "byId") {
      let { body, params } = req;
      body.id = params.id;

      const { response, status_code } = await getItemById(body, TABLE_NAME);
      _sendResponse(req, res, response, status_code);
    }
  },
  save: async function (req, res) {
    let { body, params } = req;

    const { response, status_code } = await saveItem(body, TABLE_NAME);
    _sendResponse(req, res, response, status_code);
  },
  update: async function (req, res) {
    let { body, params } = req;
    body.id = params.id;

    const { response, status_code } = await updateItem(body, TABLE_NAME);
    _sendResponse(req, res, response, status_code);
  },
  delete: async function (req, res) {
    let { body, params } = req;
    body.id = params.id;

    const { response, status_code } = await deleteItem(body, TABLE_NAME);
    _sendResponse(req, res, response, status_code);
  },
};

router.post("/profiles/_search", async (req, res) => {
  routerFunctions.search(req, res);
});

router.post("/profiles", async (req, res) => {
  routerFunctions.save(req, res);
});

router.post("/profiles/:id/_update", async (req, res) => {
  routerFunctions.update(req, res);
});

router.post("/profiles/:id/_delete", async (req, res) => {
  routerFunctions.delete(req, res);
});

router.get("/profiles", async (req, res) => {
  routerFunctions.get(req, res, "all");
});

router.get("/profiles/:id", async (req, res) => {
  routerFunctions.get(req, res, "byId");
});

router.put("/profiles/:id", async (req, res) => {
  routerFunctions.update(req, res);
});

router.delete("/profiles/:id", async (req, res) => {
  routerFunctions.delete(req, res);
});

module.exports = router;

const { sendResponse } = require("@/system/tools");
const { validation } = require("./validation");

const Service = require("./service");

const function_handler = validation(async function function_handler (event, res) {
  let { body, params, method, route } = event;
  let result = {};
  console.log("METHOD: ", method, "PATH: ", route.path);

  const routeMap = {
    GET: {
      "/profiles": "GET_ALL",
      "/profiles/:profileId": "GET_BY_ID",
    },
    POST: {
      "/profiles": "CREATE",
      "/profiles/_create": "CREATE",
      "/profiles/_search": "SEARCH",
    },
    PUT: {
      "/profiles/:profileId": "UPDATE",
    },
    DELETE: {
      "/profiles/:profileId": "DELETE",
    },
  };

  if (method === "GET" && route.path === "/profiles") {
    method = "GET_ALL";
  } else if (method === "GET" && route.path === "/profiles/:profileId") {
    method = "GET_BY_ID";
    body.profileId = params.profileId;
  } else if (
    method === "POST" &&
    ["/profiles", "/profiles/_create"].includes(route.path)
  ) {
    console.log("CREATE");
    method = "CREATE";
  } else if (method === "POST" && route.path === "/profiles/_search") {
    method = "SEARCH";
  } else if (method === "PUT" && route.path === "/profiles/:profileId") {
    method = "UPDATE";
    body.profileId = params.profileId;
  } else if (method === "DELETE" && route.path === "/profiles/:profileId") {
    console.log("DELETE");
    method = "DELETE";
    body.profileId = params.profileId;
  } else {
    console.log("ROUTE NOT FOUND");
    return { success: false, error: "NOT FOUND", data: {}, status_code: 404 };
  }

  const service = new Service(body, method);
  result = service.process();

  return result;
});

module.exports.function_handler = function_handler;

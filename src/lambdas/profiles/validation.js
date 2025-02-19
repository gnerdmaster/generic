const logger = console;
const { notAcceptable, badRequest } = require("@/system/http_utils");
const { RequestBody } = require("./request");


function validation(func) {
  return function wrapper(...args) {
    try {
      const event = args[0];
      console.log(`Input: ${JSON.stringify(event)}`);
      const response = __validation(event);
      if (response && response.statusCode >= 300) {
        return response;
      }
    } catch (e) {
      logger.error(`${func.name} *** tb_lineno: ${e.lineNumber}`);
      logger.error(e.stack);
      return badRequest("Error en el modelo de entrada", { error: e });
    }
    const output = func(...args);
    console.log(`Output: ${JSON.stringify(output)}`);
    return output;
  };
}

function __validation(event) {
  const body = event.body;
  if (body) {
    try {
      const bodyJson = JSON.parse(body);
      const bodyValidated = new RequestBody(bodyJson);
      return bodyValidated.validate();
    } catch (e) {
      if (e instanceof ValidationError) {
        logger.error(`*** tb_lineno: ${e.lineNumber}`);
        logger.error(e.stack);
        return badRequest(e.details);
      } else {
        throw e;
      }
    }
  }
  return notAcceptable("body request required");
}

module.exports = validation;

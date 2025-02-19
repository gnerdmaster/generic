const { validate } = require("class-validator");

class RequestBody {
  nombre;
  edad;
  email;

  constructor(body) {
    Object.assign(this, body);
  }

  validate() {
    const validationRules = {
      nombre: { type: "string" },
      edad: { type: "number" },
      email: { type: "string" },
    };
    return validate(this, validationRules);
  }
}

module.exports = RequestBody;

require("@/system/logger");
const express = require("express");
const app = express();
const morgan = require("morgan");

const { CoreStack } = require("@/project/core_stack");

//Configuraciones
app.set("port", process.env.PORT || 3000);
app.set("json spaces", 2);

//Middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Core Stack (routes, tables, lambdas)
CoreStack(app);

//Iniciando el servidor
app.listen(3000, () => {
  console.log(`Server listening on port ${app.get("port")}`);
});

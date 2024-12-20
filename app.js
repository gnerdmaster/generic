const getEnvironment = (env) => {
  const data = require("./package.json");
  const environments = ["dev", "qa", "prod"].includes(env)
    ? data.environment[env]
    : {};

  process.env = { ...process.env, ...environments };
};

getEnvironment("dev");

require("./aliases");

//llama a /src/index que ejecuta todo lo demás
require("./src/index");

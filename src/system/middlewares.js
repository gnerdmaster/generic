const uuid = require("uuid");
/***
 * Create logger middleware
 * @param req - Request
 * @param res - Response
 * @param next - Next
 */
const createLoggerMiddleware = (req, res, next) => {
  const RequestId = uuid.v4();
  console.log(`INIT_START Runtime Version: nodejs:${process.version}`);
  console.log(`START RequestId: ${RequestId}`);
  // Recolectar logs de inicio de request
  let log = {
    startTime: performance.now(),
    timestamp: Date.now(),
    endTime: 0,
    responseTime: 0,
    method: req.method,
    url: req.url,
    path: req.path,
    params: { ...req.params },
    headers: req.headers,
    body: req.body,
  };

  res.on("close", () => {
    log.endTime = performance.now();
    log.responseTime = log.endTime - log.startTime;
    // Recolectar logs cuando se cierra la request
    console.log(`END RequestId:`, RequestId);
    console.log(
      `REPORT RequestID: ${RequestId} Duration: ${log.responseTime.toFixed(
        3
      )} ms`
    );
  });
  // Guardar logs con un array en una función para luego guardarlos en base de datos o archivo
  // Ejecutar el siguiente middleware
  next();
};

const sendResponseMiddleware = (req, res, next, response, status_code) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  if (response && response.success) {
    res.json(response);
  } else {
    res.status(status_code).json(response);
  }

  next();
};

module.exports = {
  loggerMiddleware: createLoggerMiddleware,
  sendResponseMiddleware,
};

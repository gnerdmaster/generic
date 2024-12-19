const fs = require("fs");
const { type } = require("os");

let originalConsole = JSON.parse(JSON.stringify(console));
originalConsole.log = console.log.bind(console);
originalConsole.error = console.error.bind(console);
originalConsole.warn = console.warn.bind(console);

process.on("warning", (warning) => {
  process.stdout.write(`Warning: ${warning.message}\n`);
});

const convertToString = (arg) => {
  if (typeof arg === "object" && arg !== null) {
    return JSON.stringify(arg);
  } else if (Array.isArray(arg)) {
    return arg.join(", ");
  } else {
    return String(arg);
  }
};

// console.stderr.error = (err) => {
//   originalConsole.stderr.error(err);
//   saveInFile(err);
// };

console.error = (...args) => {
  originalConsole.error(...args);
  // const argsStr = args.map(convertToString).join(" ");
  // saveInFile(argsStr);
  //se tendrán más campos de logs, como el error, el stack, el tiempo de ejecución, etc.
};

console.log = (...args) => {
  originalConsole.log(...args);
  // const argsStr = args.map(convertToString).join(" ");
  // saveInFile(argsStr);
  //aquí queda pendiente conectarla a una tabla de logs por servicio, para luego consultar sus entradas y salidas, incluso sus impresiones
  //se tendrían qué agrupar por:
  //Servicio
  //Fecha
  //Hora
};

const writeStream = fs.createWriteStream("logs.txt");

const saveInFile = (data) => {
  try {
    writeStream.write(data + "\n");
  } catch (err) {
    originalConsole.stderr.error(
      `Error al escribir en el archivo de logs: ${err}`
    );
  }
  writeStream.on("finish", () => {
    writeStream.close();
  });
};

const _lambda = (id, function_name, code, handler, environtment) => {
  const lambda_function = {
    id: id,
    function_name: function_name,
    code: code,
    handler: handler,
    file_handler_path: code.file + "/" + handler.split(".")[0],
    function_handler: handler.split(".")[1],
    environtment: environtment,
  };

  return lambda_function;
};

module.exports = {
  _lambda,
};

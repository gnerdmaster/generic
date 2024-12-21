const make_response = (response, status_code) => {
  return {
    response,
    status_code,
  };
};

const ok = (message, data = null) => {
  const response = {
    success: true,
    message: message,
    data: data,
  };
  return make_response(response, 200);
};

const bad_request = (message, data = null) => {
  const response = {
    success: false,
    error: message,
    data: data,
  };
  return make_response(response, 400);
};

const not_found = (message, data = null) => {
  const response = {
    success: false,
    error: message,
    data: data,
  };
  return make_response(response, 404);
};

const not_aceptable = (message, data = null) => {
  const response = {
    success: false,
    error: message,
    data: data,
  };
  return make_response(response, 406);
};

const forbidden = (message, data = null) => {
  const response = {
    success: false,
    error: message,
    data: data,
  };
  return make_response(response, 403);
};

const unauthorized = (message, data = null) => {
  const response = {
    success: false,
    error: message,
    data: data,
  };
  return make_response(response, 401);
};

const conflict = (message, data = null) => {
  const response = {
    success: false,
    error: message,
    data: data,
  };
  return make_response(response, 409);
};

const internal_server_error = (message, data = null) => {
  const response = {
    success: false,
    error: message,
    data: data,
  };
  return make_response(response, 500);
};

module.exports = {
  ok,
  not_found,
  bad_request,
  not_aceptable,
  forbidden,
  unauthorized,
  conflict,
  internal_server_error,
};

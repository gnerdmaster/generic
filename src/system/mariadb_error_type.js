const mariadb_error_type = {
  ER_DUP_ENTRY: "Ya existe un item con el ID proporcionado",
  ER_PARSE_ERROR: "Error de sintaxis en la consulta SQL",
  ER_BAD_NULL_ERROR:
    "Error al intentar insertar un valor nulo en una columna que no admite nulos",
  ER_BAD_FIELD_ERROR: "Error al intentar acceder a una columna que no existe",
  ER_NO_DEFAULT_FOR_FIELD:
    "Error al intentar insertar un valor en una columna que tiene un valor predeterminado",
  ER_BAD_TABLE_ERROR: "Error al intentar acceder a una tabla que no existe",
  ER_NO_SUCH_TABLE: "Error al intentar acceder a una tabla que no existe",
  ER_ROW_IS_REFERENCED_2:
    "Error al intentar eliminar una fila que es referenciada por otra fila",
  ER_ROW_IS_REFERENCED:
    "Error al intentar eliminar una fila que es referenciada por otra fila",
};

module.exports = mariadb_error_type;

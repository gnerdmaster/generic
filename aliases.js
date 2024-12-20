/***
 * Carga los alias de los paths, ya que naturalmente nodejs y expressjs no lo hacen.
 * Es una librería que habría qué instalar.
 */
const moduleAlias = require("module-alias");
moduleAlias.addAliases({
  "@": __dirname + "/src",
});

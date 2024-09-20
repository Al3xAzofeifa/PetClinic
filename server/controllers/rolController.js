const { PrismaClient, Rol } = require("@prisma/client");

const prisma = new PrismaClient();

module.exports.get = async (request, response, next) => {
  let listRoles = [];
  for (let element in Rol) {
    switch (element) {
      case Rol.Cliente:
        listRoles.unshift({
          ["id"]: element,
          ["nombre"]: "Cliente",
        });
        break;
      case Rol.Encargado:
        listRoles.unshift({
          ["id"]: element,
          ["nombre"]: "Encargado",
        });
        break;
      // default:
      //   listRoles.unshift({ ["id"]: Rol.Cliente, ["nombre"]: "Cliente" });
      //   break;
    }
  }

  response.json(listRoles);
};
module.exports.getById = async (request, response, next) => {
  let id = request.params.id;
  let nombre = "";
  switch (Rol[id]) {
    case Rol.Administrador:
      nombre = "Administrador";
      break;
    case Rol.Encargado:
      nombre = "Encargado";
      break;
    case Rol.Cliente:
      nombre = "Cliente";
      break;
    // default:
    //   nombre = "Cliente";
    //   break;
  }
  let rol = { ["id"]: Rol[id], ["nombre"]: nombre };
  response.json(rol);
};

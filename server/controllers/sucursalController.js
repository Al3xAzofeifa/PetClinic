const { PrismaClient } = require("@prisma/client");
const { response } = require("express");
const { connect } = require("http2");
const { request } = require("https");
const prisma = new PrismaClient();

//Listado sucursal
module.exports.get = async (request, response, next) => {
  try {
    let listado = await prisma.sucursal.findMany({});
    response.json(listado);
  } catch (error) {
    next(error);
  }
};

// Obtener sucursal Por Id
module.exports.getById = async (request, response, next) => {
  try {
    let idsucursal = parseInt(request.params.id);
    let sucursal = await prisma.sucursal.findFirst({
      where: { id: idsucursal },
      include: {
        encargados: true,  // Incluir la relación encargados
      },
    });
    response.json(sucursal);
  } catch (error) {
    next(error);
  }
};


//Crear
module.exports.create = async (request, response, next) => {
  let body = request.body;
  const newSucursal = await prisma.sucursal.create({
    data: {
      nombre: body.nombre,
      descripcion: body.descripcion,
      telefono: body.telefono,
      direccion: body.direccion,
      correo: body.correo,
      estado: body.estado,
    },
  });
  response.json(newSucursal);
};

//Actualizar
module.exports.update = async (request, response, next) => {
  let body = request.body;
  let idsucursal = parseInt(request.params.id);

  const updateSucursal = await prisma.sucursal.update({
    where: {
      id: idsucursal,
    },
    data: {
      nombre: body.nombre,
      descripcion: body.descripcion,
      telefono: body.telefono,
      direccion: body.direccion,
      correo: body.correo,
      estado: body.estado,
    },
  });
  response.json(updateSucursal);
};

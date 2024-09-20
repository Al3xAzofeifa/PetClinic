const { PrismaClient } = require("@prisma/client");
const { response } = require("express");
const { connect } = require("http2");
const { request } = require("https");
const prisma = new PrismaClient();

//Listado Producto
module.exports.get = async (request, response, next) => {
  try {
    let listado = await prisma.producto.findMany({});
    response.json(listado);
  } catch (error) {
    next(error);
  }
};

//Obtener Producto Por Id
module.exports.getById = async (request, response, next) => {
  try {
    let idProducto = parseInt(request.params.id);
    let producto = await prisma.producto.findFirst({
      where: { id: idProducto },
      include: {
        categoria: true,
      },
    });
    response.json(producto);
  } catch (error) {
    next(error);
  }
};

//Crear
module.exports.create = async (request, response, next) => {
  let body = request.body;
  const newProducto = await prisma.producto.create({
    data: {
      nombre: body.nombre,
      descripcion: body.descripcion,
      precio: body.precio,
      ingrediente: body.ingrediente,
      especificacion: body.especificacion,
      categoriaId: body.categoriaId,
      estado: true,
      imagen: body.imagen,
    },
  });
  response.json(newProducto);
};

//Actualizar
module.exports.update = async (request, response, next) => {
  let body = request.body;
  let idproducto = parseInt(request.params.id);

  const updateProducto = await prisma.producto.update({
    where: {
      id: idproducto,
    },
    data: {
      nombre: body.nombre,
      descripcion: body.descripcion,
      precio: body.precio,
      ingrediente: body.ingrediente,
      especificacion: body.especificacion,
      categoriaId: body.categoriaId,
      estado: true,
      imagen: body.imagen,
    },
  });
  response.json(updateProducto);
};




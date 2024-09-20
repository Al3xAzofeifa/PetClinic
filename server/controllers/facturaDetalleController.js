const { PrismaClient } = require("@prisma/client");
const { response } = require("express");
const { connect } = require("http2");
const { request } = require("https");
const prisma = new PrismaClient();

// Listado facturaDetalle
module.exports.get = async (request, response, next) => {
  try {
    let listado = await prisma.facturaDetalle.findMany({
      include: {
        producto: true,
        servicio: true,
      },
    });
    response.json(listado);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// Eliminar facturaDetalle
module.exports.delete = async (request, response, next) => {
  try {
    const idFacturaDetalle = parseInt(request.params.id);
    const idFactura = parseInt(request.params.facturaId);

    await prisma.facturaDetalle.delete({
      where: {
        id_facturaId: {
          id: idFacturaDetalle,
          facturaId: idFactura
        }
      }
    });

    response.status(204).send(); // Enviar una respuesta sin contenido
  } catch (error) {
    next(error);
  }
};


//Obtener facturaDetalle Por Id
module.exports.getById = async (request, response, next) => {
  try {
    let idfacturaDetalle = parseInt(request.params.id);
    let facturaDetalle = await prisma.facturaDetalle.findFirst({
      where: { id: idfacturaDetalle },
      include: {
        producto: true,
        servicio: true,
      },
    });
    response.json(facturaDetalle);
  } catch (error) {
    next(error);
  }
};

// Crear facturaDetalle
module.exports.create = async (request, response, next) => {
  try {
    let body = request.body;

    // Aquí asumes que el `facturaId` viene del cuerpo de la solicitud
    const newFacturaDetalle = await prisma.facturaDetalle.create({
      data: {
        facturaId: body.facturaId,
        productoId: body.productoId,
        servicioId: body.servicioId,
        precio: body.precio,
        cantidad: body.cantidad,
        impuesto: body.impuesto,
      },
    });

    response.json(newFacturaDetalle);
  } catch (error) {
    next(error);
  }
};

//Actualizar facturaDetalle
module.exports.update = async (request, response, next) => {
  let body = request.body;
  let idfacturaDetalle = parseInt(request.params.id);

  const updatedFacturaDetalle = await prisma.facturaDetalle.update({
    where: {
      id: idfacturaDetalle,
    },
    data: {
      productoId: body.productoId,
      servicioId: body.servicioId,
      precio: body.precio,
      cantidad: body.cantidad,
      impuesto: body.impuesto,
    },
  });
  response.json(updatedFacturaDetalle);
};

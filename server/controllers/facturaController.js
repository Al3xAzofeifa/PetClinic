const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const facturaDetalleController = require("./facturaDetalleController");

//Listado Factura
module.exports.get = async (request, response, next) => {
  try {
    let listado = await prisma.factura.findMany({});
    response.json(listado);
  } catch (error) {
    next(error);
  }
};

//Obtener Factura Por Id
module.exports.getById = async (request, response, next) => {
  try {
    let idFactura = parseInt(request.params.id);
    let Factura = await prisma.Factura.findFirst({
      where: { id: idFactura },
      include: {
        usuario: true,
        sucursal: true,
        FacturaDetalle: {
          include: {
            producto: true,
            servicio: true,
          },
        },
      },
    });
    response.json(Factura);
  } catch (error) {
    next(error);
  }
};

//Obtener Factura Por IdSurcusal
module.exports.getByIdSucursal = async (request, response, next) => {
  try {
    let IdSurcusal = parseInt(request.params.id);
    let Factura = await prisma.Factura.findMany({
      where: { sucursalId: IdSurcusal },
      include: {
        usuario: {
          select: {
            nombre: true,
          },
        },
      },
    });
    response.json(Factura);
  } catch (error) {
    next(error);
  }
};

// Obtener Facturas por Nombre del Cliente
module.exports.getByCliente = async (request, response, next) => {
  try {
    const nombreCliente = request.params.nombre;
    const sucursalId = parseInt(request.params.idSucursal);

    console.log(`Nombre Cliente: ${nombreCliente}, Sucursal ID: ${sucursalId}`);

    // Busca usuarios (clientes) cuyo nombre contenga la cadena de búsqueda
    const clientes = await prisma.usuario.findMany({
      where: {
        nombre: {
          contains: nombreCliente, // Búsqueda de coincidencias parciales
        },
      },
    });

    if (clientes.length === 0) {
      console.log("No se encontraron clientes.");
      return response.json([]); // Retornar una lista vacía si no se encuentran clientes
    }

    // Buscar facturas relacionadas con los IDs de los clientes encontrados
    let facturas = await prisma.Factura.findMany({
      where: {
        usuarioId: {
          in: clientes.map((cliente) => cliente.id), // Filtrar por IDs de clientes
        },
        sucursalId: sucursalId, // Filtrar por ID de sucursal
      },
      include: {
        usuario: {
          select: {
            nombre: true, // Incluir el nombre del cliente en la respuesta
          },
        },
        sucursal: true,
        FacturaDetalle: true, // Incluir facturaDetalle de la factura
      },
    });

    response.json(facturas);
  } catch (error) {
    next(error);
  } finally {
    await prisma.$disconnect();
  }
};

// Obtener Factura Por Fecha y Sucursal
module.exports.getByFecha = async (request, response, next) => {
  try {
    const fechaStr = request.params.fecha;
    const sucursalId = parseInt(request.params.idSucursal);

    // Verifica si se proporcionó la fecha y el ID de sucursal
    if (!fechaStr || isNaN(sucursalId)) {
      return response
        .status(400)
        .json({ error: "Fecha y ID de sucursal son obligatorios" });
    }

    // Convertir la fecha en formato de inicio y fin del día
    const startOfDay = new Date(`${fechaStr}T00:00:00.000Z`);
    const endOfDay = new Date(`${fechaStr}T23:59:59.999Z`);

    let facturas = await prisma.factura.findMany({
      where: {
        fecha: {
          gte: startOfDay, // Mayor o igual al inicio del día
          lte: endOfDay, // Menor o igual al fin del día
        },
        sucursalId: sucursalId, // Filtrar por ID de sucursal
      },
      include: {
        usuario: {
          select: {
            nombre: true, // Incluir solo el campo nombre del usuario
          },
        },
      },
    });

    response.json(facturas);
  } catch (error) {
    next(error);
  } finally {
    await prisma.$disconnect();
  }
};

//crear
module.exports.create = async (request, response, next) => {
  try {
    const {
      facturaDetalle = [],
      fecha,
      usuarioId,
      sucursalId,
      total,
      estado,
    } = request.body;

    // Verificar que facturaDetalle es un arreglo
    if (!Array.isArray(facturaDetalle)) {
      return response
        .status(400)
        .json({ error: "facturaDetalle debe ser un arreglo" });
    }

    // Crear la factura y los facturaDetalle de la factura en una sola transacción
    const newFactura = await prisma.factura.create({
      data: {
        fecha,
        usuario: {
          connect: { id: usuarioId }, // Asociar con el usuario por ID
        },
        sucursal: {
          connect: { id: sucursalId }, // Asociar con la sucursal por ID
        },
        total,
        estado,
        // Crear los facturaDetalle de la factura en la misma transacción
        FacturaDetalle: {
          create: facturaDetalle.map((detalle) => ({
            productoId: detalle.productoId || null,
            servicioId: detalle.servicioId || null,
            precio: detalle.precio,
            cantidad: detalle.cantidad,
            impuesto: detalle.impuesto,
          })),
        },
      },
    });

    // Imprimir el JSON de la nueva factura en la consola
    console.log("La nueva factura es: ", JSON.stringify(newFactura, null, 2));
    response.json(newFactura);
  } catch (error) {
    console.error("Error al crear la factura:", error);
    next(error);
  }
};

module.exports.update = async (request, response, next) => {
  try {
    const { id: idFactura } = request.params;
    const {
      fecha,
      usuarioId,
      sucursalId,
      total,
      estado,
      facturaDetalle = [],
    } = request.body;

    const idFacturaInt = parseInt(idFactura);

    // Comenzar una transacción
    const result = await prisma.$transaction(async (prisma) => {
      // Actualizar la factura principal
      const updatedFactura = await prisma.factura.update({
        where: { id: idFacturaInt },
        data: {
          fecha: new Date(fecha),
          usuario: { connect: { id: usuarioId } },
          sucursal: { connect: { id: sucursalId } },
          total,
          estado,
        },
      });

      // Obtener los facturaDetalle actuales de la factura
      const facturaDetalleActuales = await prisma.facturaDetalle.findMany({
        where: { facturaId: idFacturaInt },
      });

      // Verificar que todos los productos y servicios existen antes de crear o actualizar
      for (const detalle of facturaDetalle) {
        if (detalle.productoId) {
          const producto = await prisma.producto.findUnique({
            where: { id: detalle.productoId },
          });
          if (!producto) {
            throw new Error(`Producto con ID ${detalle.productoId} no existe.`);
          }
        }

        if (detalle.servicioId) {
          const servicio = await prisma.servicio.findUnique({
            where: { id: detalle.servicioId },
          });
          if (!servicio) {
            throw new Error(`Servicio con ID ${detalle.servicioId} no existe.`);
          }
        }
      }

      // Manejar actualización y creación de facturaDetalle
      const facturaDetalleIds = new Set(
        facturaDetalle.map((detalle) => detalle.id)
      );

      for (const detalle of facturaDetalle) {
        const detalleExistente = facturaDetalleActuales.find(
          (d) => d.id === detalle.id
        );

        if (detalleExistente) {
          // Actualizar facturaDetalle existentes
          await prisma.facturaDetalle.update({
            where: {
              id_facturaId: {
                id: detalle.id,
                facturaId: idFacturaInt,
              },
            },
            data: {
              productoId: detalle.productoId || null,
              servicioId: detalle.servicioId || null,
              precio: parseFloat(detalle.precio),
              cantidad: detalle.cantidad,
              impuesto: parseFloat(detalle.impuesto),
            },
          });
        } else {
          // Crear nuevos facturaDetalle
          await prisma.facturaDetalle.create({
            data: {
              facturaId: idFacturaInt,
              productoId: detalle.productoId || null,
              servicioId: detalle.servicioId || null,
              precio: parseFloat(detalle.precio),
              cantidad: detalle.cantidad,
              impuesto: parseFloat(detalle.impuesto),
            },
          });
        }
      }

      // Eliminar los facturaDetalle que no están en la solicitud
      const facturaDetalleAEliminar = facturaDetalleActuales.filter(
        (d) => !facturaDetalleIds.has(d.id)
      );

      for (const detalle of facturaDetalleAEliminar) {
        await prisma.facturaDetalle.delete({
          where: {
            id_facturaId: {
              id: detalle.id,
              facturaId: idFacturaInt,
            },
          },
        });
      }

      return updatedFactura;
    });

    response.json(result);
  } catch (error) {
    console.error("Error al actualizar la factura:", error);
    next(error);
  }
};

//Actualizar
module.exports.updateStatus = async (request, response, next) => {
  try {
    let body = request.body;
    let idfactura = parseInt(request.params.id);

    const updateFactura = await prisma.factura.update({
      where: {
        id: idfactura,
      },
      data: {
        estado: body.estado,
      },
    });
    response.json(updateFactura);
  } catch (error) {
    next(error);
  }
};

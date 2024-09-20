const { PrismaClient } = require("@prisma/client");
const { connect } = require("http2");
const prisma = new PrismaClient();

//Listado reserva

module.exports.get = async (request, response, next) => {
  try {
    const { sucursalId } = request.query; // Obtener el parámetro de la solicitud

    // Construir el filtro de consulta
    const where = {};
    if (sucursalId) {
      where.sucursalId = parseInt(sucursalId, 10); // Aplicar el filtro si está presente
    }

    // Consultar las reservas con el filtro aplicado
    let listado = await prisma.reserva.findMany({
      where: where,
      include: {
        usuario: {
          select: {
            nombre: true  // Selecciona el campo "nombre" del cliente
          }
        },
        Estado: true  // Incluye el estado de la reserva
      }
    });

    response.json(listado);
  } catch (error) {
    next(error);
  }
};


//Obtener Reserva asociada al cliente
module.exports.getByCliente = async (request, response, next) => {
  try {
    const nombreCliente = request.params.nombre;
    const sucursalId = parseInt(request.params.idSucursal); 

    console.log(`Nombre Cliente: ${nombreCliente}, Sucursal ID: ${sucursalId}`);
    
    // Busca clientes cuyo nombre contenga la cadena de búsqueda
    const clientes = await prisma.usuario.findMany({
      where: {
        nombre: {
          contains: nombreCliente, // Búsqueda de coincidencias parciales
        }
      }
    });

    if (clientes.length === 0) {
      console.log('No se encontraron clientes.');
    }

    let reserva = await prisma.reserva.findMany({
      where: { 
        usuarioId: {
          in: clientes.map(cliente => cliente.id)
        },
        sucursalId: sucursalId 
      },
      include: {
        Estado: true,
        usuario: {
          select: {
            nombre: true
          }
        },
        sucursal: true,
        servicio: true,        
      },
    });

    response.json(reserva);
  } catch (error) {
    next(error);
  } finally {
    await prisma.$disconnect();
  }
};


//Obtener Reservas Por Fecha
module.exports.getByFecha = async (request, response, next) => {
  try {
    let date = request.params.fecha; // Usa request.query para parámetros de consulta
    const sucursalId = parseInt(request.params.idSucursal); 
    
    if (!date) {
      return response.status(400).json({ error: 'El parámetro de fecha es obligatorio' });
    }

    // Verifica y ajusta el formato de la fecha
    const startOfDay = new Date(`${date}T00:00:00Z`);
    const endOfDay = new Date(`${date}T23:59:59Z`);

    let reserva = await prisma.reserva.findMany({
      where: {
        fecha: {
          gte: startOfDay,
          lt: endOfDay
        },
        sucursalId: sucursalId 
      },
      include: {
        Estado: true,
        usuario: true,
        sucursal: true,
        servicio: true
      },
    });
    response.json(reserva);
  } catch (error) {
    next(error);
  }
};



//Obtener Reserva
module.exports.getById = async (request, response, next) => {
  try {
    let idReserva = parseInt(request.params.id);
    let reserva = await prisma.reserva.findFirst({
      where: { id: idReserva },
      include: {
        Estado: true,
        usuario: true,
        sucursal: true,
        servicio: true,        
      },
    });
    response.json(reserva);
  } catch (error) {
    next(error);
  }
};



//Crear
module.exports.create = async (request, response, next) => {
  let body = request.body;
  const newReserva = await prisma.reserva.create({
    data: {      
      descripcion: body.descripcion,
      fecha: body.fecha,
      hora: body.horaInicio,      
      // usuarioId: body.cliente,
      // sucursalId: body.sucursal.id,
      habitos: body.habitos,
      historial: body.historial,
      razon: body.razon,
      Estado: {
        connect: { id: body.estado.id }
      },
      usuario: {
        connect: { id: body.cliente }
      },
      sucursal: {
        connect: { id: body.sucursal.id }
      },
      servicio: {
        connect: { id: body.servicio }
      },
    },
  });

  // console.log(newReserva);
  // return;

  //Agregar a factura

  response.json(newReserva);
};


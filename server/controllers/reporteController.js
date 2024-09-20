const { PrismaClient, Prisma } = require("@prisma/client");

const prisma = new PrismaClient();

BigInt.prototype.toJSON = function () {
  const int = Number.parseInt(this.toString());
  return int ?? this.toString();
};

// Obtiene los servicios más vendidos en la sucursal seleccionada
module.exports.getServicioBySucursal = async (request, response, next) => {
  const sucursalId = parseInt(request.params.id);

  try {
    const result = await prisma.$queryRaw(
      Prisma.sql`SELECT 
        s.descripcion AS name,	
        SUM(fd.cantidad) AS value
      FROM 
        facturadetalle fd
      JOIN 
        factura f ON fd.facturaId = f.id
      JOIN 
        servicio s ON fd.servicioId = s.id
      JOIN 
        sucursal suc ON f.sucursalId = suc.id
      WHERE 
        suc.id = ${sucursalId}  -- Filtra por el id de la sucursal
      GROUP BY 
        fd.servicioId, s.descripcion
      ORDER BY 
        value DESC
      LIMIT 3;`
    );

    response.json(result);
  } catch (error) {
    next(error); // Manejo de errores
  }
};

//Lo 3 productos más vendidos filtrado por sucursalId
module.exports.getProductoBySucursal = async (request, response, next) => {
  const sucursalId = parseInt(request.params.id);

  try {
    const result = await prisma.$queryRaw(
      Prisma.sql`SELECT 
        p.nombre AS name,	
        SUM(fd.cantidad) AS value
      FROM 
        facturadetalle fd
      JOIN 
        factura f ON fd.facturaId = f.id
      JOIN 
        producto p ON fd.productoId = p.id
      JOIN 
        sucursal suc ON f.sucursalId = suc.id
      WHERE 
        suc.id = ${sucursalId} 
      GROUP BY 
        fd.productoId, p.nombre
      ORDER BY 
        value DESC
      LIMIT 3;`
    );

    response.json(result);
  } catch (error) {
    next(error); // Manejo de errores
  }
};


module.exports.getCitas = async (request, response, next) => {  
  const sucursalId = parseInt(request.params.id);
  try {
    const result = await prisma.$queryRaw(
      Prisma.sql`SELECT e.descripcion AS name,
       COUNT(r.id) AS value
        FROM reserva r
        JOIN estado e ON r.estadoId = e.id
        WHERE r.sucursalId = ${sucursalId}
        GROUP BY e.descripcion
        ORDER BY value DESC; `
    );

    response.json(result);
  } catch (error) {
    next(error); // Manejo de errores
  }
};



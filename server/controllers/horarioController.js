const { PrismaClient, Rol } = require("@prisma/client");
const { response } = require("express");
const { connect } = require("http2");
const { request } = require("https");
const prisma = new PrismaClient();

//Listado horario
module.exports.get = async (request, response, next) => {
  try {
    let listado = await prisma.horario.findMany({});
    response.json(listado);
  } catch (error) {
    next(error);
  }
};

//Obtener horario Por Id
// module.exports.getById = async (request, response, next) => {
//   try {
//     let idhorario = parseInt(request.params.id);

//     let sucursalId = 1;

//     let horario = await prisma.horario.findFirst({
//       where: { id: idhorario },
//       include: {
//         sucursal: true,
//       },
//     });

//     if (!horario) {
//       return response.status(404).json({ error: "Horario no encontrado" });
//     }

//     // Obtener todos los registros en SucursalHorario que correspondan al horarioId
//     let sucursalHorarios = await prisma.sucursalHorario.findMany({
//       where: { sucursalId: sucursalId }, // Filtrar por el horarioId específico
//       select: {
//         horario: {
//           select: { diaSemana: true }, // Seleccionar el campo diaSemana de la tabla Horario
//         },
//       },
//     });

//     console.log(sucursalHorarios);
//     // [
//     //   { horario: { diaSemana: 'Martes' } },
//     //   { horario: { diaSemana: 'Miercoles' } }
//     // ]

//     // Extraer solo los valores de diaSemana en un array y eliminar duplicados
//     horario.dias = sucursalHorarios;

//     response.json(horario);
//   } catch (error) {
//     next(error);
//   }
// };



module.exports.getById = async (request, response, next) => {
  try {
    let idhorario = parseInt(request.params.id);

    let horario = await prisma.horario.findFirst({
      where: { id: idhorario },      
    });
    response.json(horario);
  } catch (error) {
    next(error);
  }
};

//Crear
module.exports.create = async (request, response, next) => {
  try {
    const body = request.body;

    // Verifica que los datos necesarios estén presentes en el cuerpo de la solicitud
    if (
      !body.dias ||
      !Array.isArray(body.dias) ||
      !body.sucursal ||
      !Array.isArray(body.sucursal) ||
      !body.horaInicio ||
      !body.horaFin ||
      body.estado === undefined ||
      !body.fechas ||
      !Array.isArray(body.fechas)
    ) {
      return response
        .status(400)
        .json({ error: "Datos incompletos en la solicitud" });
    }

    const { dias, sucursal, horaInicio, horaFin, estado, fechas } = body;

    const horariosCreados = [];

    const startDate = new Date(fechas[0]);
    const endDate = new Date(fechas[1]);

    const getDayName = (date) => {
      const days = [
        "Domingo",
        "Lunes",
        "Martes",
        "Miercoles",
        "Jueves",
        "Viernes",
        "Sabado",
      ];
      return days[date.getDay()];
    };

    // Crear una lista de fechas que caen dentro del rango especificado y que coinciden con los días de la semana proporcionados
    let currentDate = new Date(startDate);
    currentDate.setHours(0, 0, 0, 0); // Ajustar la hora a medianoche al inicio

    const adjustedEndDate = new Date(endDate);
    adjustedEndDate.setHours(23, 59, 59, 999); // Ajustar el endDate para incluir todo el día

    while (currentDate <= adjustedEndDate) {
      const dayName = getDayName(currentDate);
      if (dias.some((dia) => dia.id === dayName)) {
        // Crear un nuevo horario para cada combinación de día y fecha

        for (const sucursalId of sucursal) {
          const horariosExistentes = await prisma.sucursalHorario.findMany({
            where: { sucursalId: sucursalId },
            include: { horario: true },
          });

  

          const solapamiento = horariosExistentes.some((existing) => {
            const existingHoraInicio = new Date(existing.horario.horaInicio).getTime();
            const existingHoraFin = new Date(existing.horario.horaFin).getTime();
            const newHoraInicio = new Date(horaInicio).getTime();
            const newHoraFin = new Date(horaFin).getTime();
            const existingFecha = new Date(existing.horario.fecha).toDateString(); // Convertir la fecha a formato de cadena para comparación
            const newFecha = new Date(currentDate).toDateString(); // Convertir la nueva fecha a formato de cadena para comparación
          

            console.log("Fecha Existente");
            console.log(existingFecha);

            console.log("Fecha Nuevo");
            console.log(newFecha);


            return (
              //Debe corregirse para validar tambien la fecha
              existing.horario.diaSemana === dayName &&
              existing.horario.fecha === currentDate && 
              (
                (newHoraInicio < existingHoraFin && newHoraFin > existingHoraInicio) || // Superposición parcial
                (newHoraInicio <= existingHoraInicio && newHoraFin >= existingHoraFin)  // Cubrimiento total
              )
            );
          });
          
          if (solapamiento) {
            return response.status(400).json({
              error: `Sobreposición detectada en la sucursal ${sucursalId} para el día ${dayName}.`,
            });
          }
        }

        const nuevoHorario = await prisma.horario.create({
          data: {
            diaSemana: dayName,
            fecha: currentDate.toISOString(), // Usar currentDate que ya está ajustado
            horaInicio: horaInicio,
            horaFin: horaFin,
            tipoHorario: estado,
          },
        });

        horariosCreados.push(nuevoHorario);

        // Asociar el nuevo horario con cada sucursal
        for (const sucursalId of sucursal) {
          await prisma.sucursalHorario.create({
            data: {
              sucursalId: sucursalId,
              horarioId: nuevoHorario.id,
            },
          });
        }
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    response.status(201).json(horariosCreados);
  } catch (error) {
    console.error("Error en la creación de horarios:", error);
    response.status(500).json({ error: error.message });
  }
};

//Actualizar Horario / Bloqueo
module.exports.update = async (request, response, next) => {
  try {
    const id = request.params.id;
    const body = request.body;

    // Verifica que los datos necesarios estén presentes en el cuerpo de la solicitud
    if (
      !body.dias ||
      !Array.isArray(body.dias) ||
      !body.sucursal ||
      !Array.isArray(body.sucursal) ||
      !body.horaInicio ||
      !body.horaFin ||
      body.estado === undefined ||
      !body.fechas ||
      !Array.isArray(body.fechas)
    ) {
      return response
        .status(400)
        .json({ error: "Datos incompletos en la solicitud" });
    }

    const { dias, sucursal, horaInicio, horaFin, estado, fechas } = body;

    const startDate = new Date(fechas[0]);
    const endDate = new Date(fechas[1]);

    const getDayName = (date) => {
      const days = [
        "Domingo",
        "Lunes",
        "Martes",
        "Miercoles",
        "Jueves",
        "Viernes",
        "Sabado",
      ];
      return days[date.getDay()];
    };

    let currentDate = new Date(startDate);

    // Lista de horarios actualizados
    const horariosActualizados = [];

    while (currentDate <= endDate) {
      const dayName = getDayName(currentDate);
      if (dias.some((dia) => dia.id === dayName)) {
        // Buscar si ya existe un horario con los mismos parámetros
        const existingHorario = await prisma.horario.findFirst({
          where: {
            diaSemana: dayName,
            fecha: currentDate.toISOString(), //between startDate and endDate??
          },
        });

        if (existingHorario) {
          // Actualizar el horario existente
          const updatedHorario = await prisma.horario.update({
            where: { id: existingHorario.id },
            data: {
              horaInicio: 
                  new Date(currentDate.toDateString() +" " +new Date(horaInicio).toTimeString()).toISOString(),
              horaFin: 
                  new Date(currentDate.toDateString() + " " +new Date(horaFin).toTimeString()).toISOString(),
              tipoHorario: estado,
            },
          });
          horariosActualizados.push(updatedHorario);

          // Actualizar las asociaciones con sucursales
          await prisma.sucursalHorario.deleteMany({
            where: { horarioId: updatedHorario.id },
          });

          for (const sucursalId of sucursal) {
            await prisma.sucursalHorario.create({
              data: {
                sucursalId: sucursalId,
                horarioId: updatedHorario.id,
              },
            });
          }
        } else {
          // Crear un nuevo horario si no existe
          const nuevoHorario = await prisma.horario.create({
            data: {
              diaSemana: dayName,
              fecha: currentDate.toISOString(),
              horaInicio: new Date(
                currentDate.toDateString() +
                  " " +
                  new Date(horaInicio).toTimeString()
              ).toISOString(),
              horaFin: new Date(
                currentDate.toDateString() +
                  " " +
                  new Date(horaFin).toTimeString()
              ).toISOString(),
              tipoHorario: estado,
            },
          });
          horariosActualizados.push(nuevoHorario);

          // Asociar el nuevo horario con cada sucursal
          for (const sucursalId of sucursal) {
            await prisma.sucursalHorario.create({
              data: {
                sucursalId: sucursalId,
                horarioId: nuevoHorario.id,
              },
            });
          }
        }
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    response.status(200).json(horariosActualizados);
  } catch (error) {
    console.error("Error en la actualización de horarios:", error);
    response.status(500).json({ error: error.message });
  }
};

// //Actualizar un videojuego
// module.exports.update = async (request, response, next) => {
//   let body = request.body;
//   let idVideojuego = parseInt(request.params.id);
//   //Obtener videojuego viejo
//   const videojuegoViejo = await prisma.videojuego.findUnique({
//     where: { id: idVideojuego },
//     include: {
//       generos: {
//         select:{
//           id:true
//         }
//       },
//     }
//   });

//   const updateVideojuego = await prisma.videojuego.update({
//     where: {
//       id: idVideojuego,
//     },
//     data: {
//       nombre: body.nombre,
//       descripcion: body.descripcion,
//       precio: body.precio,
//       publicar: body.publicar,
//       generos: {
//         //Generos tiene que ser {id:valor}
//         disconnect:videojuegoViejo.generos,
//         connect: body.generos,
//       },
//       plataformas: {
//         deleteMany:[{videojuegoId:idVideojuego}],
//         create: await Promise.all(body.plataformas.map(async(plat)=>{
//           return {
//             anno_lanzamiento: plat.anno_lanzamiento,
//              plataforma:{connect:{id:plat.id}}
//             }
//         }))
//       },
//     },
//   });
//   response.json(updateVideojuego);
// };

const { PrismaClient, Rol } = require("@prisma/client");
const { response } = require("express");
const { connect } = require("http2");
const { request } = require("https");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
//npm install bcrypt
const bcrypt = require("bcrypt");

//Listado Usuario
module.exports.get = async (request, response, next) => {
  try {
    let listado = await prisma.Usuario.findMany({});
    response.json(listado);
  } catch (error) {
    next(error);
  }
};

//Obtener Usuario Por Id
module.exports.getById = async (request, response, next) => {
  try {
    let idUsuario = parseInt(request.params.id);
    let Usuario = await prisma.Usuario.findFirst({
      where: { id: idUsuario },
    });
    response.json(Usuario);
  } catch (error) {
    next(error);
  }
};

// Obtener encargados disponibles
module.exports.getEncargadosDisponibles = async (request, response, next) => {
  try {
    let encargadosDisponibles = await prisma.Usuario.findMany({
      where: {
        SucursalId: null,
        rol: "Encargado",
      },
    });
    response.json(encargadosDisponibles);
  } catch (error) {
    next(error);
  }
};

//Obtener los clientes
module.exports.getClientes = async (request, response, next) => {
  try {
    let clientes = await prisma.Usuario.findMany({
      where: {
        rol: "Cliente",
      },
    });
    response.json(clientes);
  } catch (error) {
    next(error);
  }
};

//Crear
module.exports.create = async (request, response, next) => {
  let body = request.body;
  const newUsuario = await prisma.usuario.create({
    data: {
      nombre: body.nombre,
      telefono: body.telefono,
      correo: body.correo,
      direccion: body.direccion,
      nacimiento: body.nacimiento,
      contrasena: body.contrasena,
      rol: body.rol,
      SucursalId: body.SucursalId,
      estado: body.estado,
    },
  });
  response.json(newUsuario);
};

//Actualizar
module.exports.update = async (request, response, next) => {
  let body = request.body;
  let idusuario = parseInt(request.params.id);

  const updateUsuario = await prisma.usuario.update({
    where: {
      id: idusuario,
    },
    data: {
      nombre: body.nombre,
      telefono: body.telefono,
      correo: body.correo,
      direccion: body.direccion,
      nacimiento: body.nacimiento,
      contrasena: body.contrasena,
      rol: body.rol,
      SucursalId: body.SucursalId,
      estado: body.estado,
    },
  });
  response.json(updateUsuario);
};

//Crear nuevo usuario
module.exports.register = async (request, response, next) => {
  const userData = request.body;

  //Salt es una cadena aleatoria.
  //"salt round" factor de costo controla cuánto tiempo se necesita para calcular un solo hash de BCrypt
  // salt es un valor aleatorio y debe ser diferente para cada cálculo, por lo que el resultado casi nunca debe ser el mismo, incluso para contraseñas iguales
  let salt = bcrypt.genSaltSync(10);

  // Hash password
  let hash = bcrypt.hashSync(userData.password, salt);

  const user = await prisma.usuario.create({
    data: {
      nombre: userData.nombre,
      telefono: userData.telefono,
      correo: userData.email,
      direccion: userData.direccion,
      nacimiento: userData.nacimiento,
      contrasena: hash,
      rol: Rol[userData.rol],
      estado: userData.estado,
    },
  });

  response.status(200).json({
    status: true,
    message: "Usuario creado",
    data: user,
  });
};

module.exports.login = async (request, response, next) => {
  let userReq = request.body;
  //Buscar el usuario según el email dado
  const user = await prisma.Usuario.findUnique({
    where: {
      correo: userReq.email,
    },
  });

  //Sino lo encuentra según su email
  if (!user) {
    response.status(401).send({
      success: false,
      message: "Usuario no registrado",
    });
  }

  //Verifica la contraseña
  const checkPassword = await bcrypt.compare(userReq.password, user.contrasena);
  if (checkPassword === false) {
    response.status(401).send({
      success: false,
      message: "Credenciales no validas",
    });
  } else {
    //Usuario correcto
    let nombreSucursal = ""; // Usa 'let' en lugar de 'const'
    if (user.SucursalId) {
      const sucursal = await prisma.sucursal.findFirst({
        where: {
          id: user.SucursalId,
        },
      });
          
      if (sucursal) {
        nombreSucursal = sucursal.nombre;
      }
    }
    
    //Crear el payload
    const payload = {
      id: user.id,
      correo: user.correo,
      nombre: user.nombre,
      rol: user.rol,
      idSucursal: user.SucursalId,
      nombreSucursal: nombreSucursal,
    };

    //Crear el token
    const token = jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRE,
    });
    response.json({
      success: true,
      message: "Usuario registrado",
      token,
    });
  }
};

const express = require("express");
const router = express.Router();

//Controlador
const usuarioController = require("../controllers/usuarioController");

//Rutas locahost:3000/usuario/

//Listado de usuarios
router.get("/", usuarioController.get);

//Listado de usuario con rol encargado y sin idSucursal
router.get('/getEncargadosDisponibles', usuarioController.getEncargadosDisponibles); // Obtener encargados disponibles

//Usuario por rol = 'cliente'
router.get('/getClientes', usuarioController.getClientes);

//usuario por Id
router.get("/:id", usuarioController.getById);

//Crear usuario
router.post('/',usuarioController.create)

//Actualizar usuario
router.put('/:id', usuarioController.update)

//Acceso al Login
router.post("/login", usuarioController.login);

//Acceso a subscribe
router.post("/registrar", usuarioController.register);


module.exports = router;

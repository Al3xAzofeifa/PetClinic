const express = require("express");
const router = express.Router();

//Controlador
const reservaController = require("../controllers/reservaController");
//Rutas locahost:3000/reserva/

//Listado Reserva

router.get("/", reservaController.get);

//Obtener Reserva por Id
router.get("/:id", reservaController.getById);

//Obtener Reserva por fecha
router.get('/byFecha/:fecha/:idSucursal', reservaController.getByFecha);

//Obtener Reserva por Filtro de nombre cliente
router.get('/byCliente/:nombre/:idSucursal', reservaController.getByCliente)

//Crear Reserva
router.post("/", reservaController.create);

 
module.exports = router;

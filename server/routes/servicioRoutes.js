const express = require("express");
const router = express.Router();

//Controlador
const servicioController = require("../controllers/servicioController");

//Rutas locahost:3000/servicio/

//Listado de servicios
router.get("/", servicioController.get);

//servicio por Id
router.get("/:id", servicioController.getById);

//Crear servicio
router.post('/',servicioController.create)

//Actualizar servicio
router.put('/:id', servicioController.update)

module.exports = router;

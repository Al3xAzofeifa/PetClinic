const express = require("express");
const router = express.Router();

//Controlador
const sucursalController = require("../controllers/sucursalController");

//Rutas locahost:3000/sucursal/

//Listado de sucursals
router.get("/", sucursalController.get);

//sucursal por Id
router.get("/:id", sucursalController.getById);

//Crear servicio
router.post('/',sucursalController.create)

//Actualizar servicio
router.put('/:id', sucursalController.update)

module.exports = router;

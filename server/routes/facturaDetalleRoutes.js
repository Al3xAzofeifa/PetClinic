const express = require("express");
const router = express.Router();

//Controlador
const facturaDetalleController = require("../controllers/facturaDetalleController");

//Rutas locahost:3000/facturaDetalle/

//Listado facturaDetalle
router.get("/", facturaDetalleController.get);

//Obtener facturaDetalle
router.get("/:id", facturaDetalleController.getById);

//Obtener idFactura
// router.get("/:id", facturaDetalleController.getByIdFactura);

//Crear facturaDetalle
router.post("/", facturaDetalleController.create);

//Actualizar servicio
router.put("/:id", facturaDetalleController.update);

module.exports = router;

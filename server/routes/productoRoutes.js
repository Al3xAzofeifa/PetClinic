const express = require("express");
const router = express.Router();

//Controlador
const productoController = require("../controllers/productoController");

//Rutas locahost:3000/producto/

//Listado de productos
router.get("/", productoController.get);

//Producto por Id
router.get("/:id", productoController.getById);

//Crear servicio
router.post('/',productoController.create)

//Actualizar servicio
router.put('/:id', productoController.update)

module.exports = router;

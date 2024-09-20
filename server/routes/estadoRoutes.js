const express = require("express");
const router = express.Router();

//Controlador
const estadoController = require("../controllers/estadoController");

//Rutas locahost:3000/categoria/

//Listado Categoria
router.get("/", estadoController.get);

//Obtener Categoria
router.get('/:id', estadoController.getById);

module.exports = router;
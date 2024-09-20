const express = require("express");
const router = express.Router();

//Controlador
const categoriaController = require("../controllers/categoriaController");

//Rutas locahost:3000/categoria/

//Listado Categoria
router.get("/", categoriaController.get);

//Obtener Categoria
router.get('/:id', categoriaController.getById);

module.exports = router;

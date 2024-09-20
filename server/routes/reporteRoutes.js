//Express para agregar las rutas
const express = require("express");
const router = express.Router();

//Videojuego controller para los métodos definidos
const reporteController = require("../controllers/reporteController");

//Definición de rutas para generos

router.get("/vj-servicio/:id", reporteController.getServicioBySucursal);

router.get("/vj-producto/:id", reporteController.getProductoBySucursal);

router.get("/vj-citas/:id", reporteController.getCitas);

module.exports = router;
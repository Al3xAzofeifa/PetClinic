const express = require("express");
const router = express.Router();

//Controlador
const sucursalHorario = require("../controllers/sucursalHorarioController");

//Rutas locahost:3000/horario/

//Listado de horarios
router.get("/", sucursalHorario.get);

//horario por Id
router.get("/:id", sucursalHorario.getById);

module.exports = router;

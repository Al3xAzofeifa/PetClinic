const express = require("express");
const router = express.Router();

//Controlador
const horarioController = require("../controllers/horarioController");

//Rutas locahost:3000/horario/

//Listado de horarios
router.get("/", horarioController.get);

//horario por Id
router.get("/:id", horarioController.getById);

//Crear horario
router.post('/',horarioController.create)

//Actualizar Horario
router.put('/:id', horarioController.update)

module.exports = router;

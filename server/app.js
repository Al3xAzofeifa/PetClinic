const dotEnv = require("dotenv");
const express = require("express");
const { PrismaClient } = require("@prisma/client");
const { request, response } = require("express");
const cors = require("cors");
const logger = require("morgan");
const app = express();
const chalk = require("chalk");
const path = require("path");

//Ruta para imagenes
global.__basedir = __dirname;

//---Archivos de rutas---
const fileRouter = require("./routes/fileRoutes");
const categoriaRouter = require("./routes/categoriaRoutes");
const estadoRouter = require("./routes/estadoRoutes");
const productoRouter = require("./routes/productoRoutes");
const reservaRouter = require("./routes/reservaRoutes");
const facturaRouter = require("./routes/facturaRoutes");
const facturaDetalleRouter = require("./routes/facturaDetalleRoutes");
const usuarioRouter = require("./routes/usuarioRoutes");
const servicioRouter = require("./routes/servicioRoutes");
const sucursalRouter = require("./routes/sucursalRoutes");
const horarioRouter = require("./routes/horarioRoutes");
const sucursalHorarioRouter = require("./routes/sucursalHorarioRoutes");
const reporteRouter = require("./routes/reporteRoutes");
const rolRouter = require("./routes/rolRoutes")

// Acceder a la configuracion del archivo .env
dotEnv.config();
// Puero que escucha por defecto 300 o definido .env
const port = process.env.PORT || 3000;
// Middleware CORS para aceptar llamadas en el servidor
app.use(cors());
// Middleware para loggear las llamadas al servidor
app.use(logger("dev"));
// Middleware para gestionar Requests y Response json
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

//---- Definir rutas ----
app.use("/file/", fileRouter);
app.use("/categoria", categoriaRouter);
app.use("/estado", estadoRouter);
app.use("/producto", productoRouter);
app.use("/reserva", reservaRouter);
app.use("/factura", facturaRouter);
app.use("/facturaDetalle", facturaDetalleRouter);
app.use("/usuario", usuarioRouter);
app.use("/servicio", servicioRouter);
app.use("/sucursal", sucursalRouter);
app.use("/horario", horarioRouter);
app.use("/sucursalHorario", sucursalHorarioRouter);
app.use("/reporte", reporteRouter);
app.use("/rol", rolRouter);

//Acceso a las imagenes
app.use(
  "/images",
  express.static(path.join(path.resolve(), "/assets/uploads"))
);

// Servidor
app.listen(port, () => {
  console.log(chalk.blue(`http://localhost:${port}`));
  console.log(chalk.blue.bgRed("Presione CTRL-C para deternerlo\n"));
});

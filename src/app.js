const path = require("path");
const express = require("express");
const morgan = require("morgan");
const expressLayouts = require("express-ejs-layouts");

const config = require("./config/entorno");
const {
  identificarSolicitud,
  medirDuracion,
} = require("./middleware/solicitudes");

// 1. Importar la fábrica de rutas
const { crearRutasReservas } = require("./rutas/reservas");

function crearApp(servicioReservas) {
  const app = express();

  // Guardar el servicio en app.locals para que esté disponible globalmente si se requiere
  app.locals.servicioReservas = servicioReservas;

  // 1. Configuración de Motor de Plantillas (EJS y layouts)
  app.set("view engine", "ejs");
  app.set("views", path.join(__dirname, "../views"));
  app.use(expressLayouts);
  app.set("layout", "layout");

  // 2. Logging dinámico según entorno y Middlewares personalizados
  app.use(morgan(config.morganFormat));
  app.use(identificarSolicitud);
  app.use(medirDuracion);

  // 3. Archivos estáticos (CSS, JS cliente, imágenes)
  app.use(express.static(path.join(__dirname, "../public")));

  // 4. Parsers de cuerpo de petición
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  // 5. Rutas principales
  app.get("/", (req, res) => {
    app.locals.servicioReservas = servicioReservas;
    res.render("inicio", { titulo: "Inicio", seccion: "inicio" });
  });

  // Ruta /estado corregida para devolver cantidad real y el ID de solicitud
  app.get("/estado", (req, res) => {
    const cantidad = servicioReservas ? servicioReservas.contar() : 0;
    res.json({
      estado: "activo",
      cantidadReservas: cantidad,
      solicitudId:
        res.locals.idSolicitud || res.locals.solicitudId || "BIB-000",
    });
  });

  // 6. Montaje de rutas modulares (inyectando la instancia del servicio única)
  app.use("/reservas", crearRutasReservas(servicioReservas));

  // 7. Manejo global de rutas no encontradas (404)
  app.use((req, res) => {
    res.status(404).render("no-encontrado", {
      titulo: "Página no encontrada",
      seccion: "404",
      mensaje: "La ruta a la que intentas acceder no existe en el servidor.",
    });
  });

  return app;
}

module.exports = { crearApp };
const path = require("path");
const express = require("express");
const morgan = require("morgan");
const expressLayouts = require("express-ejs-layouts");

const {
  identificarSolicitud,
  medirDuracion,
} = require("./middleware/solicitudes");

// 1. Importar las fábricas de rutas y servicios
const { crearRutasReservas } = require("./rutas/reservas");
const { crearServicioReservas } = require("./servicios/reservas");

function crearApp() {
  const app = express();

  // Instanciar el servicio usando su función fábrica
  const servicioReservas = crearServicioReservas();

  // 1. Configuración de Motor de Plantillas (EJS y layouts)
  app.set("view engine", "ejs");
  app.set("views", path.join(__dirname, "../views"));
  app.use(expressLayouts);
  app.set("layout", "layout");

  // 2. Logging y Middlewares personalizados de solicitudes
  app.use(morgan("dev"));
  app.use(identificarSolicitud);
  app.use(medirDuracion);

  // 3. Archivos estáticos (CSS, JS cliente, imágenes)
  app.use(express.static(path.join(__dirname, "../public")));

  // 4. Parsers de cuerpo de petición
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  // 5. Rutas principales
  app.get("/", (req, res) => {
    res.render("inicio", { titulo: "Inicio" });
  });

  app.get("/estado", (req, res) => {
    res.json({
      servicio: "activo",
      solicitudId: res.locals.solicitudId,
    });
  });

  // 6. Montaje de rutas modulares (inyectando la instancia del servicio)
  app.use("/reservas", crearRutasReservas(servicioReservas));

  // 7. Manejo global de rutas no encontradas (404)
  app.use((req, res) => {
    res.status(404).render("no-encontrado", {
      titulo: "Página no encontrada",
      mensaje: "La ruta a la que intentas acceder no existe en el servidor.",
    });
  });

  return app;
}

module.exports = { crearApp };

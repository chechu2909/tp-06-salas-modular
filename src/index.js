const { crearApp } = require("./app");
const { obtenerConfiguracion } = require("./configuracion");
const { crearServicioReservas } = require("./servicios/reservas");

const config = obtenerConfiguracion();

// Instancia única compartida del servicio con datos iniciales (semilla)
const datosIniciales = [
  {
    id: 1,
    sala: "Sala A",
    turno: "Mañana",
    email: "estudiante1@unahur.edu.ar",
    personas: 2,
    fecha: "2026-06-01",
  },
  {
    id: 2,
    sala: "Sala B",
    turno: "Tarde",
    email: "estudiante2@unahur.edu.ar",
    personas: 3,
    fecha: "2026-06-02",
  },
];
const servicioReservas = crearServicioReservas(datosIniciales);

// Se inyecta el servicio al crear la aplicación de Express
const app = crearApp(servicioReservas);

app.listen(config.port, () => {
  console.log(
    `Servidor escuchando en http://localhost:${config.port} (${config.nodeEnv})`,
  );
});

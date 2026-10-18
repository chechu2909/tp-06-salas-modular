const { crearApp } = require("./app");
const { obtenerConfiguracion } = require("./configuracion");
const { crearServicioReservas } = require("./servicios/reservas");

const config = obtenerConfiguracion();

// Instancia única compartida del servicio con datos iniciales (semilla)
const datosIniciales = [];
const servicioReservas = crearServicioReservas(datosIniciales);

// Se inyecta el servicio al crear la aplicación de Express
const app = crearApp(servicioReservas);

app.listen(config.port, () => {
  console.log(
    `Servidor escuchando en http://localhost:${config.port} (${config.nodeEnv})`,
  );
});

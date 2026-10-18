const { Router } = require("express");
const { crearControladorReservas } = require("../controladores/reservas");
const { validarReserva } = require("../middleware/reservas");

/**
 
 * @param {Object} servicio 
 * @returns {Router} 
 */
function crearRutasReservas(servicio) {
  const router = Router();
  const controlador = crearControladorReservas(servicio);

  router.get("/", controlador.listar);
  router.get("/nueva", controlador.formularioNueva);
  router.post("/", validarReserva, controlador.crear);
  router.get("/:id", controlador.detalle);

  return router;
}

module.exports = { crearRutasReservas };

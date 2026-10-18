function crearControladorReservas(servicio) {
  const salasPermitidas = ["Sala Norte", "Sala Sur", "Sala Multimedia"];
  const turnosPermitidos = ["Mañana", "Tarde", "Noche"];

  return {
    inicio: (req, res) => {
      res.render("inicio", {
        titulo: "Inicio",
        seccion: "Inicio",
        idSolicitud: req.idSolicitud,
      });
    },

    estado: (req, res) => {
      res.json({
        cantidad: servicio.contar(),
        idBiblioteca: servicio.obtenerIdBiblioteca(),
      });
    },

    listar: (req, res) => {
      const reservas = servicio.listar();
      res.render("reservas/lista", {
        titulo: "Listado de Reservas",
        seccion: "Reservas",
        reservas,
        idSolicitud: req.idSolicitud,
      });
    },

    formularioNueva: (req, res) => {
      res.render("reservas/nueva", {
        titulo: "Nueva Reserva",
        seccion: "Reservas",
        valores: {},
        valoresPrevios: {},
        error: null,
        salasPermitidas,
        turnosPermitidos,
        idSolicitud: req.idSolicitud,
      });
    },

    detalle: (req, res) => {
      const { id } = req.params;
      const reserva = servicio.buscarPorId(id);
      if (!reserva) {
        return res.status(404).render("no-encontrado", {
          titulo: "No encontrado",
          seccion: "Reservas",
          mensaje: "La reserva solicitada no existe.",
          idSolicitud: req.idSolicitud,
        });
      }
      res.render("reservas/detalle", {
        titulo: "Detalle de Reserva",
        seccion: "Reservas",
        reserva,
        idSolicitud: req.idSolicitud,
      });
    },

    crear: (req, res) => {
      servicio.crear(req.reservaValidada);
      res.redirect("/reservas");
    },
  };
}

module.exports = { crearControladorReservas };

function crearServicioReservas(datosIniciales = []) {
  // El arreglo vive en memoria y se comparte en esta instancia
  let reservas = [...datosIniciales];

  return {
    listar: () => reservas,

    buscarPorId: (id) => {
      return reservas.find((r) => String(r.id) === String(id));
    },

    contar: () => reservas.length,

    obtenerIdBiblioteca: () => "BIB-01", // ID requerido por la ruta /estado

    crear: (nuevaReserva) => {
      // Generar un ID único simple basado en la fecha o contador
      const id = Date.now().toString();
      const reservaConId = { id, ...nuevaReserva };
      reservas.push(reservaConId);
      return reservaConId;
    },
  };
}

module.exports = { crearServicioReservas };

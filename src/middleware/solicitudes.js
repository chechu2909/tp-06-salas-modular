function identificarSolicitud(req, res, next) {
  // Lógica para el ID de solicitud
  next();
}

function medirDuracion(req, res, next) {
  const inicio = Date.now();
  res.on("finish", () => {
    const duracion = Date.now() - inicio; // <-- Aquí se usa la variable 'duracion'
    console.log(`[MEDICIÓN] Solicitud - Duración: ${duracion}ms`);
  });
  next();
}

module.exports = { identificarSolicitud, medirDuracion };

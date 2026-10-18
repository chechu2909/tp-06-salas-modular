function obtenerConfiguracion() {
  const puertoEnv = process.env.PORT;
  let port = 3000;

  if (puertoEnv !== undefined && puertoEnv !== "") {
    port = Number(puertoEnv);
    if (!Number.isInteger(port) || port < 1 || port > 65535) {
      console.error(
        `Error: Puerto inválido ("${puertoEnv}"). Debe ser un número entero entre 1 y 65535.`,
      );
      process.exit(1);
    }
  }

  const nodeEnv = process.env.NODE_ENV || "development";
  const morganFormat = nodeEnv === "production" ? "combined" : "dev";

  return {
    port,
    nodeEnv,
    morganFormat,
  };
}

module.exports = { obtenerConfiguracion };

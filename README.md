# TP 07 - Persistencia inicial de reservas de salas

## 1. Punto de partida y nombre de la copia
- **Nombre de la carpeta/repositorio:** `tp-07-salas-mongodb`
- **Punto de partida:** Copia funcional y estructurada del TP 06 de reservas de salas de estudio.

## 2. Entorno y Versiones
- **Node.js:** v26.7.0 o superior.
- **Base de datos:** MongoDB Atlas (Clúster gratuito M0 Free Tier).
- **Base de datos utilizada:** `reservas_salas_u7` (colección `reservas`).
- **ODM:** Mongoose.

## 3. Guía de instalación y configuración (Desde una descarga nueva)
1. Clonar el repositorio e instalar las dependencias:
   ```bash
   npm install

   Configurar el clúster en MongoDB Atlas:

Crear un clúster gratuito Free (M0).

Crear un usuario de base de datos con permisos de lectura y escritura.

Configurar el acceso a la red permitiendo la IP correspondiente (o 0.0.0.0/0 para desarrollo).

Configurar las variables de entorno:

Copiar el archivo de plantilla .env.example y renombrarlo a .env:

Bash
cp .env.example .env

Reemplazar los marcadores en .env con la URI real provista por Atlas.

4. Diagnóstico DNS y Comandos de Ejecución
Diagnóstico DNS: Se configuró explícitamente node:dns (dns.setServers(["8.8.8.8", "1.1.1.1"])) en el módulo de conexión (src/config/base-datos.js) para asegurar una resolución correcta de los registros SRV/TXT de MongoDB Atlas.

Comandos de ejecución:

Comprobar conexión:

Bash
node --env-file=.env scripts/comprobar-conexion.js
Crear reserva de prueba:

Bash
node --env-file=.env scripts/crear-reserva.js
Listar reservas guardadas:

Bash
node --env-file=.env scripts/listar-reservas.js
Controles de calidad (Linter y Formato):

Bash
npm run format
npm run check
npm run lint
Iniciar aplicación web (Servidor Express):

Bash
npm start
5. Mapa de archivos y arquitectura

tp-07-salas-mongodb/
  src/
    config/
      entorno.js
      base-datos.js
    modelos/
      reserva.js
    controladores/
    middleware/
    rutas/
    servicios/
    app.js
    index.js
  scripts/
    comprobar-conexion.js
    crear-reserva.js
    listar-reservas.js
  views/
  public/
  .env.example
  .gitignore
  eslint.config.js
  package.json
  package-lock.json
  README.md


  Esquema y Modelo: Se define el modelo Reserva enlazado explícitamente a la colección reservas mediante Mongoose, aplicando validaciones de tipo, rangos y enumeraciones.


  6. Campos y Reglas del Modelo

 | Campo | Tipo | Regla mínima / Validación |
| --- | --- | --- |
| estudiante | String | Obligatorio, sin espacios en extremos (`trim`) |
| email | String | Obligatorio, `trim`, presencia de `@` (`match: /@/`) |
| sala | String | Obligatorio (`enum`: Sala Norte, Sala Sur, Sala Multimedia) |
| fecha | String | Obligatorio, no vacío tras `trim` |
| turno | String | Obligatorio (`enum`: Mañana, Tarde, Noche) |
| personas | Number | Obligatorio, entero entre 1 y 6 (`Number.isInteger`, `min`, `max`) |

7. Matriz de Pruebas

| Caso | Resultado observado |
| --- | --- |
| Conexión válida | Confirmación de conexión exitosa y proceso finalizado limpiamente. |
| Variable MONGODB_URI vacía | Fallo de configuración indicado y término del proceso sin éxito. |
| Contraseña incorrecta en `.env` | Fallo de autenticación en Atlas, sin crear documentos. |
| Colección vacía | Listado exitoso con cantidad 0, sin errores. |
| Reserva válida | Guardado exitoso y devolución del `_id` de MongoDB. |
| Consulta desde proceso nuevo | Recuperación correcta del documento previo mediante el `_id`. |
| Segunda consulta | Muestra el listado actualizado sin alterar ni duplicar registros automáticamente. |
| Estudiante vacío (Prueba negativa) | Rechazo por parte del modelo, cantidad de registros sin cambios. |
| Email sin `@` (Prueba negativa) | Rechazo por validación de expresión regular, sin escritura. |
| Sala o turno fuera del enum (Prueba negativa) | Rechazo del modelo, sin escritura. |
| Personas fuera de rango (0, 7, 2.5) (Prueba negativa) | Rechazo por límites numéricos o validación de entero, sin cambios. |

8. Continuidad del sitio web
El servicio web Express continúa operando en memoria para el flujo de vistas y formularios visuales de la aplicación, desacoplándose de los scripts de persistencia de terminal en esta etapa. La migración completa del servicio HTTP hacia Mongoose se abordará en la siguiente unidad.

9. Seguridad y Privacidad
Se confirma que el archivo .env (que contiene credenciales sensibles y la URI privada) se encuentra excluido del control de versiones mediante .gitignore.

Se versiona únicamente el archivo de plantilla .env.example sin datos confidenciales ni información personal.
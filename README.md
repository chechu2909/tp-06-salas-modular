# Trabajo práctico 06 - Refactorización modular de reservas

## Proyecto de partida y cambios realizados
El proyecto parte de una copia exacta e independiente del Trabajo Práctico 05 (`tp-06-salas-modular`), conservando la funcionalidad del sistema de gestión de reservas de salas de estudio sin modificar las vistas EJS, el layout, el archivo CSS estático ni la lógica del dominio.

Los cambios principales respecto a la entrega anterior abarcan:
- Separación de responsabilidades en módulos independientes (`index.js`, `configuracion.js`, `app.js`, controladores, servicios, rutas y middleware).
- Inyección de dependencias mediante la creación de una instancia única (singleton) del servicio de reservas (`crearServicioReservas`) en el punto de entrada (`src/index.js`), que es compartida por la aplicación y el controlador.
- Externalización de variables de entorno para puerto (`PORT`) y modo de ejecución (`NODE_ENV`), permitiendo alternar el formato de registros de Morgan entre `dev` y `combined`.
- Incorporación de reglas de calidad de código mediante ESLint y Prettier.

---

## Instalación y ejecución

### Requisitos previos
- Node.js (versión LTS recomendada)
- npm

### Pasos para la instalación
```bash
npm install

Comandos de ejecución
Iniciar servidor en desarrollo:

Bash
npm start
Iniciar servidor con entorno local (.env):

Bash
npm run start:local

Formato y análisis estático
Aplicar formato con Prettier:

Bash
npm run format
Verificar formato y linter:

Bash
npm run check

Configuración del entorno
El archivo src/configuracion.js procesa las variables de entorno de process.env:

PORT: Define el puerto en el que escuchará el servidor (por defecto 3000). Se valida que sea un número entero entre 1 y 65535. En caso de un puerto inválido, la aplicación termina su ejecución con un mensaje claro.

NODE_ENV: Define el entorno de ejecución (development o production). Selecciona la estrategia de logs en Morgan: dev para desarrollo y combined para producción.

Ejemplo de .env.example
Fragmento de código
PORT=3000
NODE_ENV=development


Mapa de módulos y dependencias

tp-06-salas-modular/
├── public/
│   └── css/
│       └── estilos.css
├── src/
│   ├── controladores/
│   │   └── reservas.js
│   ├── middleware/
│   │   ├── reservas.js
│   │   └── solicitudes.js
│   ├── rutas/
│   │   └── reservas.js
│   ├── servicios/
│   │   └── reservas.js
│   ├── app.js
│   ├── configuracion.js
│   └── index.js
├── views/
├── .env.example
├── .gitignore
├── eslint.config.js
├── package.json
└── README.md

Responsabilidad de cada módulo
src/index.js: Punto de entrada de la aplicación. Lee la configuración, inicializa la semilla de datos y la instancia del servicio de reservas (crearServicioReservas), crea la instancia de Express inyectándole el servicio y levanta el servidor mediante app.listen. No declara rutas ni validaciones.

src/configuracion.js: Procesa y valida process.env. Convierte PORT a número entero validando su rango y define el formato de registro de Morgan.

src/app.js: Configura la aplicación Express (motor de plantillas EJS, layouts, middlewares globales, parseo de cuerpo de solicitudes y archivos estáticos), monta el router de reservas y gestiona el middleware final para errores 404 (páginas no encontradas).

src/rutas/reservas.js: Define las rutas relativas (/, /nueva, /:id) asociándolas con sus respectivos middlewares y controladores.

src/controladores/reservas.js: Recibe las peticiones HTTP y la instancia del servicio. Lee parámetros, envía respuestas JSON, renderiza vistas EJS pasando las variables requeridas (titulo, seccion, valores, salasPermitidas, turnosPermitidos, etc.) o realiza redirecciones.

src/servicios/reservas.js: Contiene la lógica de negocio pura y la gestión del arreglo de reservas en memoria (listar, buscar por ID, contar y crear). No interactúa directamente con req/res, ni maneja vistas ni códigos HTTP.

src/middleware/solicitudes.js: Asigna un identificador de solicitud único (idSolicitud) a cada petición y mide la duración hasta la emisión de la respuesta (finish).

src/middleware/reservas.js: Valida los datos recibidos mediante POST en el formulario de creación. En caso de error, responde con estado 400 y renderiza el formulario conservando los datos previos e informando el mensaje de error. Si la validación es correcta, delega mediante next().

Pipeline y contrato de rutas
Orden del Pipeline Middleware
Morgan: Registro de solicitudes (dev / combined).

identificarSolicitud: Genera/asigna el ID de la solicitud.

medirDuracion: Mide el tiempo invertido en procesar la respuesta.

express-ejs-layouts: Soporte para layouts en vistas.

express.static: Servidor de recursos estáticos (/public).

express.urlencoded / express.json: Parseo del cuerpo de peticiones.

Router de Aplicación (/reservas): Evaluación y enrutamiento de solicitudes.

Manejador 404: Captura solicitudes a URLs no existentes y renderiza no-encontrado.ejs.

Contrato de Rutas

Método,Ruta,Descripción,Respuesta / Estado
GET,/,Página principal de inicio,200 OK
GET,/estado,Estado de la API (JSON con contador e ID),200 OK
GET,/reservas,Listado completo de reservas,200 OK
GET,/reservas/nueva,Formulario para nueva reserva,200 OK
GET,/reservas/:id,Detalle de reserva existente,200 OK
GET,/reservas/:id,Detalle de reserva inexistente,404 Not Found
POST,/reservas,Creación válida de reserva,302 Found (Redirige a /reservas)
POST,/reservas,Creación inválida de reserva,400 Bad Request
GET,/css/estilos.css,Archivo CSS estático,200 OK
GET,/url-inexistente,Ruta no definida,404 Not Found

Matriz antes/después

Caso de prueba,Resultado Esperado,TP 05 (Línea de base),TP 06 (Refactorizado),Evidencia / Observación
Inicio y CSS,200 OK,200 OK,200 OK,Carga correcta de inicio.ejs y estilos.css con ID visible.
Estado inicial,200 OK,200 OK,200 OK,Devuelve JSON con la cantidad en memoria e ID de biblioteca.
Listado y detalle,200 OK,200 OK,200 OK,Muestra reservas cargadas en memoria.
Detalle inexistente,404 Not Found,404 Not Found,404 Not Found,Renderiza vista HTML no-encontrado.ejs sin interrupción del servidor.
Formulario,200 OK,200 OK,200 OK,Carga nueva.ejs con selectores desplegables poblados.
POST vacío,400 Bad Request,400 Bad Request,400 Bad Request,Rechaza formulario vacío y conserva estado.
Sala no permitida,400 Bad Request,400 Bad Request,400 Bad Request,Detiene alta si la sala no pertenece al listado.
Email sin @,400 Bad Request,400 Bad Request,400 Bad Request,Muestra mensaje de error en el formulario.
"Personas 0, 7 o fraccionarias",400 Bad Request,400 Bad Request,400 Bad Request,Valida rango entero entre 1 y 6.
POST válido,302 -> 200,302 -> 200,302 -> 200,"Crea reserva, redirige a /reservas e incrementa contador en /estado."
URL inexistente,404 Not Found,404 Not Found,404 Not Found,Carga página 404 personalizada.
Reinicio de servidor,200 OK,200 OK,200 OK,Retorna a los datos de la semilla inicial.
Puerto alternativo,200 OK,N/A,200 OK,PORT=4000 npm start escucha en el puerto especificado.
Puerto inválido,Falla al iniciar,N/A,Salida con error,PORT=99999 detiene la aplicación con mensaje descriptivo.

Persistencia temporal y límites

Almacenamiento en memoria: Las reservas se gestionan en un único arreglo en memoria encapsulado en el servicio de reservas (servicios/reservas.js).

Persistencia volatil: No se utiliza base de datos ni persistencia física en disco. Al reiniciar el servidor Node.js, los registros creados mediante peticiones POST se eliminan y el estado del servicio regresa al arreglo inicial (semilla).

Inexistencia de res/req en el servicio: El servicio opera independientemente de la capa de transporte HTTP (req, res, respuestas EJS o códigos HTTP), asegurando una clara separación entre la lógica de negocio y los controladores de Express.


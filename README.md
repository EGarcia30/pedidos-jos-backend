README.md - Pedidos Backend API (Express.js + Node.js)
Esta es la API backend para el sistema de pedidos de comida rápida salvadoreña. Proporciona endpoints para productos y pedidos, conectada a Supabase para almacenamiento de datos.​

Características
Endpoints RESTful para /api/productos y /api/pedidos.

Integración con Supabase (productos, pedidos, inventario).

Soporte CORS para frontend React en Vercel.

Variables de entorno seguras (.env).

Desarrollo con nodemon para auto-reload.

Tecnologías
Backend: Node.js, Express.js

Base de Datos: Supabase (PostgreSQL)

Cliente DB: @supabase/supabase-js

Utils: dotenv, cors, nodemon

Deploy: Render (gratis)

Estructura del Proyecto
text
pedidos-backend/
├── src/
│   └── server.js      # Servidor principal + rutas
├── .env              # Variables Supabase (NO subir a Git)
├── package.json
└── README.md
Instalación Local
Clona el repositorio: git clone <tu-repo-backend>

Entra a la carpeta: cd pedidos-backend

Instala dependencias: npm install

Crea .env con tus claves Supabase:

text
SUPABASE_URL=tu_url_supabase
SUPABASE_ANON_KEY=tu_anon_key
PORT=3000
Inicia desarrollo: npm run dev

API lista en http://localhost:3000

Endpoints Disponibles
Método	Endpoint	Descripción
GET	/api/productos	Lista todos los productos
GET	/api/pedidos	Lista todos los pedidos
POST	/api/pedidos	Crear nuevo pedido
Prueba con Postman o curl: curl http://localhost:3000/api/productos​

Scripts package.json
json
{
  "scripts": {
    "dev": "nodemon src/server.js",
    "start": "node src/server.js"
  }
}
Despliegue en Render (Gratis)
Push a GitHub.

render.com → New → Web Service → Conecta repo.

Configuración:

Build Command: npm install

Start Command: npm start

Environment Variables: Agrega SUPABASE_URL y SUPABASE_ANON_KEY

URL: https://tu-api.onrender.com​

Configuración CORS (para React)
En server.js:

js
const cors = require('cors');
app.use(cors({ origin: 'https://tu-frontend.vercel.app' }));
npm install cors

Variables de Entorno Requeridas
text
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
PORT=3000
Solución de Problemas
Error dotenv: npm install dotenv

Supabase no conecta: Verifica claves en .env y RLS policies.

Render no inicia: Revisa logs → Variables de entorno faltantes.

CORS bloqueado: Instala/configura cors middleware.

Conexión Frontend-Backend
Frontend React consume:

text
const API_URL = import.meta.env.VITE_API_URL || 'https://tu-api.onrender.com'
fetch(`${API_URL}/api/productos`)
¡API lista para producción! 🚀 Deploy en Render y conecta con Vercel frontend.

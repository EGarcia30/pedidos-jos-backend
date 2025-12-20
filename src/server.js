const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Rutas
const db = require('./config/database');
const productosRouter = require('./routes/productos');
const pedidosRouter = require('./routes/pedidos');
const pedidosDetalleRouter = require('./routes/pedidos-detalle');
const dashboardRouter = require('./routes/dashboard');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/productos', productosRouter);
app.use('/api/pedidos', pedidosRouter);
app.use('/api/pedidos-detalle', pedidosDetalleRouter);
app.use('/api/dashboard', dashboardRouter);

app.get('/', (req, res) => res.json({ message: 'Pedidos API v1.0.0' }));

// Manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Error interno del servidor' });
});

// ✅ FUNCIÓN para iniciar servidor (desarrollo)
const startServer = async () => {
    try {
        await db.pool.connect();
        console.log('✅ Conectado a PostgreSQL');
        
        if (process.env.NODE_ENV === 'production') {
            console.log('🚀 Serverless Vercel modo producción');
            // Vercel maneja el listen automáticamente
        } else {
            app.listen(PORT, () => {
                console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`);
            });
        }
    } catch (err) {
        console.error('❌ Error conectando a PostgreSQL:', err);
        process.exit(1);
    }
};

// ✅ VERCEL: Exporta la app SIN listen
module.exports = app;

// ✅ DESARROLLO LOCAL: Inicia servidor si se ejecuta directamente
if (require.main === module) {
    startServer();
}

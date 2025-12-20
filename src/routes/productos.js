// src/routes/productos.js
const express = require('express');
const router = express.Router();
const db = require('../config/database');

// 🟢 GET todos los productos
router.get('/', async (req, res) => {
try {
    const query = `
        SELECT id, nombre, cantidad_disponible, precio_compra, precio_venta, fecha_creado 
        FROM productos 
        ORDER BY nombre ASC
    `;
    const { rows } = await db.pool.query(query);
    res.json({
        success: true,
        count: rows.length,
        data: rows
    });
} catch (error) {
    console.error('Error productos:', error);
    res.status(500).json({ error: error.message });
}
});

module.exports = router;
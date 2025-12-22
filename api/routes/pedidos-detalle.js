const express = require('express');
const db = require('../config/database');  // Ajusta la ruta
const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { pedido_id, producto_id, cantidad_vendida, precio_venta, subtotal } = req.body;
        
        // ✅ FECHA LOCAL CST (El Salvador)
        const fechaLocal = new Date().toISOString();
        
        const query = `
        INSERT INTO pedidos_detalle (pedido_id, producto_id, cantidad_vendida, precio_venta, subtotal, fecha_creado)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, fecha_creado as fecha
        `;
        
        const { rows } = await db.query(query, [pedido_id, producto_id, cantidad_vendida, precio_venta, subtotal, fechaLocal]);
        res.json({ success: true, id: rows[0].id, fecha: rows[0].fecha });
    } catch (error) {
        console.error('Error detalle:', error);
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;

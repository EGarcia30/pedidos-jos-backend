const express = require('express');
const db = require('../config/database');  // Ajusta la ruta
const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { pedido_id, producto_id, cantidad_vendida, precio_venta, subtotal } = req.body;
        
        const query = `
        INSERT INTO pedidos_detalle (pedido_id, producto_id, cantidad_vendida, precio_venta, subtotal)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id
        `;
        
        const { rows } = await db.query(query, [pedido_id, producto_id, cantidad_vendida, precio_venta, subtotal]);
        res.json({ success: true, id: rows[0].id });
    } catch (error) {
        console.error('Error detalle:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

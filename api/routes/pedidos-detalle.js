const express = require('express');
const db = require('../config/database');  // Ajusta la ruta
const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { pedido_id, producto_id, cantidad_vendida, precio_venta, subtotal } = req.body;
        
        // ✅ HORA LOCAL CST (El Salvador)
        const ahora = new Date();
        const fechaLocal = ahora.toLocaleString('sv-SV', { 
            timeZone: 'America/El_Salvador' 
        });
        
        const query = `
        INSERT INTO pedidos_detalle (pedido_id, producto_id, cantidad_vendida, precio_venta, subtotal, fecha_creado)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, fecha_creado
        `;
        
        const { rows } = await db.query(query, [
            pedido_id, 
            producto_id, 
            cantidad_vendida, 
            precio_venta, 
            subtotal, 
            fechaLocal  // ← "2025-12-22 09:26:48"
        ]);
        
        res.json({ success: true, id: rows[0].id });
    } catch (error) {
        console.error('Error detalle:', error);
        res.status(500).json({ error: error.message });
    }
});



module.exports = router;

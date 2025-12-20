// src/routes/pedidos.js
const express = require('express');
const router = express.Router();
const db = require('../config/database');

// 🟢 GET todos los pedidos
router.get('/', async (req, res) => {
    try {
        const query = `
            SELECT id, cliente, direccion, estado, fecha_creado, total
            FROM pedidos 
            WHERE estado != 'entregado'
            ORDER BY fecha_creado ASC
        `;
        const { rows } = await db.pool.query(query);
        res.json({
            success: true,
            count: rows.length,
            data: rows
        });
    } catch (error) {
        console.error('Error pedidos:', error);
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const { cliente, direccion, estado, total } = req.body;
        const query = `
        INSERT INTO pedidos (cliente, direccion, estado, total) 
        VALUES ($1, $2, $3, $4) 
        RETURNING id
        `;
        const { rows } = await db.query(query, [cliente, direccion, estado, total]);
        
        // ✅ DEVUELVE EL ID
        res.json({ 
        success: true, 
        id: rows[0].id  // ← ESTO ES CLAVE
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET Detalles por pedido ID
router.get('/:id/detalle', async (req, res) => {
    try {
        const { id } = req.params;
        const query = `
        SELECT pd.*, p.nombre, p.precio_venta as precio_original
        FROM pedidos_detalle pd
        JOIN productos p ON pd.producto_id = p.id
        WHERE pd.pedido_id = $1
        ORDER BY pd.fecha_creado
        `;
        const { rows } = await db.query(query, [id]);
        console.log('Detalles encontrados:', rows); // DEBUG
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error('Error detalles:', error);
        res.status(500).json({ error: error.message });
    }
});

// PATCH /api/pedidos/:id/entregado
router.patch('/:id/entregado', async (req, res) => {
    try {
        const { id } = req.params;
        
        const query = `
        UPDATE pedidos 
        SET estado = 'entregado' 
        WHERE id = $1 
        RETURNING id, estado
        `;
        
        const { rows } = await db.query(query, [id]);
        
        if (rows.length === 0) {
        return res.status(404).json({ error: 'Pedido no encontrado' });
        }
        
        console.log('Pedido marcado como entregado:', rows[0]);
        res.json({ 
        success: true, 
        message: 'Pedido marcado como entregado',
        data: rows[0]
        });
    } catch (error) {
        console.error('Error PATCH entregado:', error);
        res.status(500).json({ error: error.message });
    }
});



module.exports = router;
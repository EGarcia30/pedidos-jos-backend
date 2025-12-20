const express = require('express');
const db = require('../config/database');
const router = express.Router();

router.get('/', async (req, res) => {
try {
    const { periodo } = req.query;
    let whereClause = '';
    let params = [];

    // Filtros por periodo
    switch (periodo) {
    case 'hoy':
        whereClause = `WHERE pd.fecha_creado >= CURRENT_DATE`;
        break;
    case 'semana':
        whereClause = `WHERE pd.fecha_creado >= date_trunc('week', CURRENT_DATE)`;
        break;
    case 'mes':
        whereClause = `WHERE pd.fecha_creado >= date_trunc('month', CURRENT_DATE)`;
        break;
    case 'año':
        whereClause = `WHERE pd.fecha_creado >= date_trunc('year', CURRENT_DATE)`;
        break;
    default:
        whereClause = '';
    }

    const query = `
    SELECT 
        COALESCE(SUM(p.precio_compra * pd.cantidad_vendida), 0) as gasto,
        COALESCE(SUM(pd.subtotal), 0) as ventas,
        COALESCE(SUM(pd.subtotal - (p.precio_compra * pd.cantidad_vendida)), 0) as utilidad,
        COALESCE(COUNT(DISTINCT CASE WHEN pe.estado = 'entregado' THEN pe.id END), 0) as pedidos_entregados
    FROM pedidos_detalle pd
    JOIN productos p ON pd.producto_id = p.id
    LEFT JOIN pedidos pe ON pd.pedido_id = pe.id
    ${whereClause}
    `;

    const { rows } = await db.query(query, params);
    const stats = rows[0];

    res.json({ 
    success: true, 
    data: {
        gasto: parseFloat(stats.gasto),
        ventas: parseFloat(stats.ventas),
        utilidad: parseFloat(stats.utilidad),
        pedidosEntregados: parseInt(stats.pedidos_entregados)
    }
    });
} catch (error) {
    console.error('Error dashboard:', error);
    res.status(500).json({ error: error.message });
}
});

module.exports = router;

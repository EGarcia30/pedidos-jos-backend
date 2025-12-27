const express = require('express');
const db = require('../config/database');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const { periodo } = req.query;
        let whereClause = '';
        let params = [];
        const tzLocal = "America/El_Salvador";

        switch (periodo) {
            case 'hoy':
                whereClause = `WHERE DATE(pd.fecha_creado AT TIME ZONE '${tzLocal}') = DATE(CURRENT_DATE AT TIME ZONE '${tzLocal}')`;
                break;
            case 'semana':
                whereClause = `WHERE date_trunc('week', pd.fecha_creado AT TIME ZONE '${tzLocal}') = date_trunc('week', CURRENT_DATE AT TIME ZONE '${tzLocal}')`;
                break;
            case 'mes':
                whereClause = `WHERE DATE_TRUNC('month', pd.fecha_creado AT TIME ZONE '${tzLocal}') = DATE_TRUNC('month', CURRENT_DATE AT TIME ZONE '${tzLocal}')`;
                break;
            case 'año':
                whereClause = `WHERE EXTRACT(YEAR FROM pd.fecha_creado AT TIME ZONE '${tzLocal}') = EXTRACT(YEAR FROM CURRENT_DATE AT TIME ZONE '${tzLocal}')`;
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

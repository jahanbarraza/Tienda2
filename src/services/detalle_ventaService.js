import {pool} from '../db.js';
import boom from '@hapi/boom';

//creamos la clase
export class DetalleVentaService {

    constructor(){};


    async findOne(id){
        const {rows} = await pool.query('SELECT * FROM detalle_ventas WHERE detalle_id = $1', [id])
        if (rows.length === 0 ) {
            throw boom.notFound('Detalle de Venta no encontrado')
        }
        return rows[0]
    }

    //agregar un producto a la venta y descontamos del inventario
    async create(data){
        const {rows} = await pool.query(
            `INSERT INTO detalle_ventas (venta_id, producto_id, cantidad, precio_unitario) VALUES ($1, $2, $3, $4) RETURNING *`,
                [ data.venta_id, data.producto_id, data.cantidad, data.precio_unitario]
        );

        //actualizamos el stok del inventario
        await pool.query('UPDATE inventario SET stock = stock - $1 WHERE producto_id = $2',
                          [data.cantidad, data.producto_id]
        );

        return rows[0]


    }

    // eliminar un producto de la venta
    async delete(id) {
        const {rows} = await pool.query('SELECT * FROM detalle_ventas WHERE detalle_id = $1', [id])
        if (rows.length === 0 ) {
            throw boom.notFound('Detalle de Venta no encontrado')
        }

        await pool.query('DELETE FROM detalle_ventas WHERE detalle_id = $1', [id])
        return rows[0]
    }
}

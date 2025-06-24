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
/*    async create(data){
        const {rows} = await pool.query(
            `INSERT INTO detalle_ventas (venta_id, producto_id, cantidad, precio_unitario) VALUES ($1, $2, $3, $4) RETURNING *`,
                [ data.venta_id, data.producto_id, data.cantidad, data.precio_unitario]
        );

        //actualizamos el stok del inventario
        await pool.query('UPDATE inventario SET stock = stock - $1 WHERE producto_id = $2',
                          [data.cantidad, data.producto_id]
        );

        return rows[0]


    }*/
    async create(data) {
  try {
    // Verificar stock disponible antes de hacer la salida
    const { rows } = await pool.query(`
      SELECT 
        SUM(CASE WHEN tipo_movimiento = 'entrada' THEN cantidad ELSE 0 END) -
        SUM(CASE WHEN tipo_movimiento = 'salida' THEN cantidad ELSE 0 END) AS stock_actual
      FROM inventario
      WHERE producto_id = $1
    `, [data.producto_id]);

    const stockDisponible = rows[0].stock_actual ?? 0;

    if (stockDisponible < data.cantidad) {
      throw new Error(`Stock insuficiente para el producto ${data.producto_id}. Disponible: ${stockDisponible}`);
    }

    // Insertar en detalle_ventas
    const { rows: detalleRows } = await pool.query(
      `INSERT INTO detalle_ventas (venta_id, producto_id, cantidad, precio_unitario)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [data.venta_id, data.producto_id, data.cantidad, data.precio_unitario]
    );

    // Registrar movimiento de salida en inventario
    await pool.query(
      `INSERT INTO inventario (producto_id, tipo_movimiento, cantidad, fecha)
       VALUES ($1, 'salida', $2, NOW())`,
      [data.producto_id, data.cantidad]
    );

    return detalleRows[0];

  } catch (error) {
    console.error('❌ Error en detalle_ventaService.create:', {
      data,
      mensaje: error.message
    });
    throw error;
  }
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

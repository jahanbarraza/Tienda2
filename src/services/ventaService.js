import {pool} from '../db.js';
import boom from '@hapi/boom';
import { DetalleVentaService } from '../services/detalle_ventaService.js'


const detalle_ventaService = new DetalleVentaService();

//creamos la clase
export class VentaService {

  constructor(){};

  async find() {
    return new Promise( async(resolve, reject) => {
      try {
        const { rows } = await pool.query('SELECT * FROM ventas')
        resolve( rows )
      } catch (error) {
        reject(error)
      }
    })
  }

  async findOne(id) {
    const { rows } = await pool.query('SELECT * FROM ventas WHERE venta_id = $1', [id])
    if ( rows.lenght === 0 ) {
      throw boom.notFound('Venta no Encontrada')
    }
    return rows[0]
  }

  //insertamos la venta y obtenemos su id
  async create(data) {
    try {
      console.log('Datos recibidos para crear venta:', JSON.stringify(data));
      
      //calculamos el total de la venta si no viene especificado
      let totalVenta = data.total;
      if (!totalVenta && data.detalles) {
        totalVenta = data.detalles.reduce((total, detalle) => {
          return total + (detalle.cantidad * detalle.precio_unitario);
        }, 0);
      }

      // Si no hay cliente_id, usamos NULL
      const cliente_id = data.cliente_id || null;

      const {rows: ventaRows} = await pool.query(
        'INSERT INTO ventas (usuario_id, cliente_id, total) VALUES ($1, $2, $3) RETURNING *',
        [data.usuario_id, cliente_id, totalVenta]);
      const venta_id = ventaRows[0].venta_id;

      //insertamos los productos llamando el servicio de crear en DetalleVentaService
      if (data.detalles && Array.isArray(data.detalles)) {
        for (const detalle of data.detalles) {
          await detalle_ventaService.create({
            venta_id,
            producto_id: detalle.producto_id,
            cantidad: detalle.cantidad,
            precio_unitario: detalle.precio_unitario
          });
        }
      }
      
      return {venta: ventaRows[0], mensaje: 'Venta registrada con éxito'};
    } catch (error) {
      console.error('Error al crear venta:', error);
      throw error;
    }
  }

  async update(id, data) {
    try {
      const { rows } = await pool.query(`SELECT * FROM ventas WHERE venta_id = $1`, [id]);

      if (rows.length === 0) {
        throw boom.notFound('Venta no encontrada');
      }

      // Construcción dinámica de la consulta
      const filas = Object.keys(data); // Extraer las propiedades enviadas
      if (filas.length === 0) {
        throw boom.badRequest('No se proporcionaron datos para actualizar');
      }

      const valores = Object.values(data);
      const setQuery = filas.map((field, index) => `${field} = $${index + 1}`).join(', ');

      // Agregar el ID al final de los valores
      valores.push(id);

      // Ejecutamos la Actualización
      const query = `UPDATE ventas SET ${setQuery} WHERE venta_id = $${valores.length} RETURNING *`;
      console.log('Query de actualización:', query);
      console.log('Valores:', valores);
      
      const updateVenta = await pool.query(query, valores);
      
      return updateVenta.rows[0];
    } catch (error) {
      console.error('Error al actualizar venta:', error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const { rows } = await pool.query(`SELECT * FROM ventas WHERE venta_id = $1`, [id]);
      
      if (rows.length === 0) {
        throw boom.notFound('Venta no encontrada');
      }

      await pool.query('DELETE FROM ventas WHERE venta_id = $1', [id]);
      return rows[0];
    } catch (error) {
      console.error('Error al eliminar venta:', error);
      throw error;
    }
  }
}

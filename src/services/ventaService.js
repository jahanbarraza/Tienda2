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
  //calculamos el total de la venta
    const totalVenta = data.productos.reduce((total, producto) => {
      return total + (producto.cantidad * producto.precio_unitario);
    }, 0)

    const {rows:  ventaRows } = await pool.query(
      'INSERT INTO ventas (usuario_id, cliente_id, total) VALUES ($1, $2, $3) RETURNING *',
      [ data.usuario_id, data.cliente_id, totalVenta ]  );
    const venta_id = ventaRows[0].venta_id

  //insertamos los productos llamando el servicio de crear en DetalleVentaService
    for ( const producto of data.productos) {
      await detalle_ventaService.create({
        venta_id,
        producto_id: producto.producto_id,
        cantidad: producto.cantidad,
        precio_unitario: producto.precio_unitario
      });
    }
    return {venta: ventaRows[0], mensaje: 'Venta registrada con exito'}
  }

  async update(id, data) {
    const { rows } = await pool.query(`SELECT * FROM productos WHERE producto_id = $1`, [id])

    if ( rows.length === 0) {
      throw boom.notFound('Producto no encontrado');
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
    const updateVenta = await pool.query(query, valores);

    return updateVenta.rows[0]
  }

  async delete(id) {
    const { rows } = await pool.query(`SELECT * FROM ventas WHERE venta_id = $1`, [id])
    console.log(rows)
    if ( rows.length === 0) {
      throw boom.notFound('Producto no encontrado');
    }

    const venta = await pool.query('DELETE FROM ventas WHERE venta_id = $1', [id])
    return rows[0]
  }
}

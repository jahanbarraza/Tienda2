import { pool } from "../db.js";
import boom from '@hapi/boom';

//creamos la clase

export class InventarioService {

  constructor() {

  }

  async find() {
    return new Promise( async(resolve, reject) => {
      try {
        const { rows } = await pool.query('SELECT * FROM invetnario')
        resolve( rows )
      } catch (error) {
        reject(error)
      }
    })
  }

  async findOne(producto_id) {
    try {
      const { rows } = await pool.query('SELECT * FROM inventario WHERE  producto_id = $1', [producto_id])
      if (rows.length === 0) {
        throw boom.notFound(`Producto con id ${producto_id} no encontrado`)
      }
      return rows[0]
    } catch (error) {
      throw boom.badImplementation('Error al obtener el inventario del producto')
    }
  }

  async updateInvantaio(producto_id, data) {
    if (data < 0) {
      throw boom.badRequest('El stock no puede ser negativo')
    }
    //verificamos el producto
    const { rows } = await pool.query('SELECT * FROM inventario WHERE  producto_id = $1', [producto_id])
    if (rows.length === 0) {
      throw boom.notFound(`Producto con id ${producto_id} no encontrado`)
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

    //ejecuatamos la actualización
    const query = `UPDATE inventario SET ${setQuery} WHERE producto_id = $${valores.length} RETURNING *`;
    const updateInventario = await pool.query(query, valores);

    return updateInventario.rows[0]
  }
}

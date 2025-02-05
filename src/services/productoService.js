import {pool} from '../db.js';
import boom  from '@hapi/boom'


//creamos la clase

export class ProductoService {

  constructor(){}

  async find() {
    return new Promise( async(resolve, reject )=> {
      try {
        const { rows } = await pool.query('SELECT * FROM productos')
        resolve(rows)
      } catch (error) {
        reject(error)
      }
    })
  }

  async findOne(id){
     const { rows } = await pool.query(`SELECT * FROM productos WHERE producto_id = $1`, [id])

            if ( rows.length === 0) {
                throw boom.notFound('Producto no encontrado');
            }
            return rows[0]
  }

  async create(data) {
    const {rows} = await pool.query(
      'INSERT INTO productos (nombre, descripcion, precio, stock, codigo_barra, categoria_id ) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
      [data.nombre, data.descripcion, data.precio, data.stock, data.codigo_barra, data.categoria_id]);
  return rows[0]
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

                    // Ejecutar la actualización
                    const query = `UPDATE productos SET ${setQuery} WHERE producto_id = $${valores.length} RETURNING *`;
                    const updatedProducto = await pool.query(query, valores);

                    return updatedProducto.rows[0];
  }

  async delete(id) {
    const { rows } = await pool.query(`SELECT * FROM productos WHERE producto_id = $1`, [id])

            if ( rows.length === 0) {
                throw boom.notFound('Producto no encontrado');
            }
            const usuario = await pool.query(`DELETE  FROM productos WHERE producto_id = ${id}`)
            return rows[0]
  }
/*
  async registroInv () {
    console.log('entro')
    const respuesta = {"message": "Inventario Registrado con Exito"}
    return respuesta
  }*/
}

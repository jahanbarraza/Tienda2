import {pool} from '../db.js'
import boom from '@hapi/boom';

//creamos la clase

export class CategoriaService {

  constructor(){}

  async find() {
    return new Promise(async (resolve, reject) => {
      try {
        const { rows } = await pool.query("SELECT * FROM categorias");
        resolve(rows);
      } catch (error) {
        reject(error);
      }
    })
  };

  async findOne( id ) {
    const { rows } = await pool.query(`SElECT * FROM categorias WHERE categoria_id = $1`, [id])

    if ( rows.length === 0 ){
      throw boom.notFound('Usuario no Encontrado');
    }
    return rows[0]
  }

  async create( data ) {
    const { rows } = await pool.query(
      `INSERT INTO categorias ( nombre, descripcion ) VALUES ($1, $2) RETURNING * `,
      [data.nombre, data.descripcion])
      return rows[0]
  };

  async update( id, data) {
    const { rows } = await pool.query(`SElECT * FROM categorias WHERE categoria_id = $1`, [id])

    if ( rows.length === 0 ){
      throw boom.notFound('Usuario no Encontrado');
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
    const query = `UPDATE categorias SET ${setQuery} WHERE categoria_id = $${valores.length} RETURNING *`;
    const updatedCategoria = await pool.query(query, valores);

    return updatedCategoria.row[0]
  }

  async delete( id ) {
    const { rows } = await pool.query(`SElECT * FROM categorias WHERE categoria_id = $1`, [id])

    if ( rows.length === 0 ){
      throw boom.notFound('Usuario no Encontrado');
    }
    const categoria = await pool.query(`DELETE FROM categorias WHERE categoria_id = ${id}`)
    return rows[0]
  }

}



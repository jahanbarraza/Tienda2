import {pool} from '../db.js';
import boom from '@hapi/boom';

//creamos la clase

export class ClienteService {

  constructor(){};

  async find() {
    return new Promise ( async(resolve, reject) => {
      try {
        const { rows } = await pool.query('SELECT * FROM clientes')
        resolve( rows )
      } catch (error) {
        reject(error)
      }
    })
  };

  async findOne(id) {
    const { rows } = await pool.query('SELECT * FROM clientes WHERE cliente_id = $1', [id])

    if ( rows.length === 0 ) {
      throw boom.notFound('Cliente no Encontrado')
    }
    return rows[0]
  };

  async create( data ) {
    const {rows} = await pool.query(
      'INSERT INTO clientes (nombre, apellido, email, telefono, direccion) VALUES ($1,$2,$3,$4,$5) RETURNING *',
    [data.nombre, data.apellido, data.email, data.telefono, data.direccion ]);
    return rows[0]
  };

  async update( id, data ) {
    const {rows} = await pool.query('SELECT * FROM clientes WHERE cliente_id = $1', [id])
    if ( rows.length === 0 ) {
      throw boom.notFound('Cliente no Encontrado')
    }
    //Construcción dinamica de la consulta
    const filas = Object.keys(data); // Extraer las propiedades enviadas
    if (filas.length === 0) {
      throw boom.badRequest('No se proporcionaron datos para actualizar');
    }

    const valores = Object.values(data);
    const setQuery = filas.map((field, index) => `${field} = $${index + 1}`).join(', ');

    // Agregar el ID al final de los valores
    valores.push(id);

    //Ejecutamos la actualización
    const query = `UPDATE clientes SET ${setQuery} WHERE cliente_id =$${valores.length} RETURNING *`;
    const updateCliente = await pool.query(query, valores);

    return updateCliente.rows[0]

  };

  async delete( id ) {
    const {rows} = await pool.query('SELECT * FROM clientes WHERE cliente_id = $1', [id])
    if ( rows.length === 0 ) {
      throw boom.notFound('Cliente no Encontrado')
    }
    const usuario = await pool.query(`DELETE FROM clientes WHERE cliente_id = ${id}`)
    return rows[0]
  }
}

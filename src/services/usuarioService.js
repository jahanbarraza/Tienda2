import {pool} from '../db.js';
import boom from '@hapi/boom';

//Creamos la Clase

export class UsuarioService {

    constructor(){}

    async find() {
        return new Promise(async (resolve, reject) => {
            try {
                const { rows } = await pool.query("SELECT * FROM usuarios");
                resolve(rows);
            } catch (error) {
                reject(error);
            }
        });
    }

    async findOne( id ) {
        const { rows } = await pool.query(`SELECT * FROM usuarios WHERE user_id = $1`, [id])

        if ( rows.length === 0) {
            throw boom.notFound('Usuario no encontrado');
        }
        return rows[0]
    }

    async create( data ){
        const {rows} = await pool.query(
            'INSERT INTO usuarios (nombre, apellido, email, telefono, contrasena, rol) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
            [data.nombre, data.apellido, data.email, data.telefono, data.contrasena, data.rol]);
        return rows[0]
    }

    async update( id, data) {
        const { rows } = await pool.query(`SELECT * FROM usuarios WHERE user_id = $1`, [id])
        if ( rows.length === 0) {
            throw boom.notFound('Usuario no encontrado');

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
        const query = `UPDATE usuarios SET ${setQuery} WHERE user_id = $${valores.length} RETURNING *`;
        const updatedUser = await pool.query(query, valores);

        return updatedUser.rows[0];
    }

    async delete( id ) {
        const { rows } = await pool.query(`SELECT * FROM usuarios WHERE user_id = $1`, [id])
        if ( rows.length === 0) {
            throw boom.notFound('Usuario no encontrado');
        }else {
            const usuario = await pool.query(`DELETE  FROM usuarios WHERE user_id = ${id}`)
            return rows[0]
          }

    }

}




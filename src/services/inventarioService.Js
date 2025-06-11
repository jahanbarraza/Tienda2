import { pool } from "../db.js";
import boom from '@hapi/boom';

export class InventarioService {
  constructor() {}

  async find() {
    try {
      const { rows } = await pool.query('SELECT i.*, p.nombre as producto_nombre FROM inventario i JOIN productos p ON i.producto_id = p.producto_id ORDER BY i.fecha DESC');
      return rows;
    } catch (error) {
      console.error('Error al obtener movimientos de inventario:', error);
      throw boom.badImplementation('Error al obtener movimientos de inventario');
    }
  }

  async findOne(producto_id) {
    try {
      const { rows } = await pool.query('SELECT i.*, p.nombre as producto_nombre FROM inventario i JOIN productos p ON i.producto_id = p.producto_id WHERE i.producto_id = $1 ORDER BY i.fecha DESC', [producto_id]);
      return rows;
    } catch (error) {
      console.error(`Error al obtener movimientos del producto ${producto_id}:`, error);
      throw boom.badImplementation('Error al obtener los movimientos del producto');
    }
  }

  async create(data) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      // Validar datos
      if (!data.producto_id || !data.tipo_movimiento || !data.cantidad) {
        throw boom.badRequest('Faltan datos requeridos: producto_id, tipo_movimiento, cantidad');
      }
      
      if (data.cantidad <= 0) {
        throw boom.badRequest('La cantidad debe ser mayor a cero');
      }
      
      if (!['entrada', 'salida'].includes(data.tipo_movimiento)) {
        throw boom.badRequest('Tipo de movimiento inválido. Debe ser "entrada" o "salida"');
      }
      
      // Verificar que el producto existe
      const { rows: productos } = await client.query('SELECT * FROM productos WHERE producto_id = $1', [data.producto_id]);
      if (productos.length === 0) {
        throw boom.notFound(`Producto con id ${data.producto_id} no encontrado`);
      }
      
      // Verificar stock suficiente en caso de salida
      if (data.tipo_movimiento === 'salida' && productos[0].stock < data.cantidad) {
        throw boom.badRequest(`Stock insuficiente. Stock actual: ${productos[0].stock}`);
      }
      
      // Actualizar stock del producto
      const nuevoStock = data.tipo_movimiento === 'entrada' 
        ? productos[0].stock + data.cantidad 
        : productos[0].stock - data.cantidad;
      
      await client.query('UPDATE productos SET stock = $1 WHERE producto_id = $2', [nuevoStock, data.producto_id]);
      
      // Registrar movimiento en inventario
      const { rows: movimiento } = await client.query(
        'INSERT INTO inventario (producto_id, tipo_movimiento, cantidad, fecha) VALUES ($1, $2, $3, NOW()) RETURNING *',
        [data.producto_id, data.tipo_movimiento, data.cantidad]
      );
      
      await client.query('COMMIT');
      
      // Devolver movimiento con datos adicionales
      return {
        ...movimiento[0],
        producto_nombre: productos[0].nombre,
        stock_actual: nuevoStock
      };
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error al crear movimiento de inventario:', error);
      if (boom.isBoom(error)) {
        throw error;
      }
      throw boom.badImplementation('Error al registrar movimiento de inventario');
    } finally {
      client.release();
    }
  }

  async updateInventario(producto_id, data) {
    try {
      // Validar datos
      if (data.stock < 0) {
        throw boom.badRequest('El stock no puede ser negativo');
      }
      
      // Verificar que el producto existe
      const { rows: productos } = await pool.query('SELECT * FROM productos WHERE producto_id = $1', [producto_id]);
      if (productos.length === 0) {
        throw boom.notFound(`Producto con id ${producto_id} no encontrado`);
      }
      
      // Actualizar stock del producto
      const { rows: productoActualizado } = await pool.query(
        'UPDATE productos SET stock = $1 WHERE producto_id = $2 RETURNING *',
        [data.stock, producto_id]
      );
      
      // Registrar movimiento en inventario
      const diferencia = data.stock - productos[0].stock;
      if (diferencia !== 0) {
        const tipo_movimiento = diferencia > 0 ? 'entrada' : 'salida';
        const cantidad = Math.abs(diferencia);
        
        await pool.query(
          'INSERT INTO inventario (producto_id, tipo_movimiento, cantidad, fecha) VALUES ($1, $2, $3, NOW())',
          [producto_id, tipo_movimiento, cantidad]
        );
      }
      
      return productoActualizado[0];
    } catch (error) {
      console.error(`Error al actualizar stock del producto ${producto_id}:`, error);
      if (boom.isBoom(error)) {
        throw error;
      }
      throw boom.badImplementation('Error al actualizar stock del producto');
    }
  }

  async getProductosStockBajo(limite = 10) {
    try {
      const { rows } = await pool.query(
        `SELECT p.*, c.nombre as categoria_nombre 
         FROM productos p 
         LEFT JOIN categorias c ON p.categoria_id = c.categoria_id 
         WHERE p.stock <= $1 
         ORDER BY p.stock ASC`,
        [limite]
      );
      return rows;
    } catch (error) {
      console.error('Error al obtener productos con stock bajo:', error);
      throw boom.badImplementation('Error al obtener productos con stock bajo');
    }
  }
}

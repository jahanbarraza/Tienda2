import { Router } from 'express';
import { InventarioService } from "../services/inventarioService.Js";
import { validarToken } from '../middlewares/auth.handler.js';

const router = Router();
const service = new InventarioService();

/**
 * @swagger
 * /api/v1/inventario:
 *   get:
 *     summary: Obtiene todos los movimientos de inventario
 *     tags: [Inventario]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de movimientos de inventario
 */
router.get('/', validarToken, async (req, res, next) => {
  try {
    const movimientos = await service.find();
    res.json(movimientos);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/v1/inventario/producto/{id}:
 *   get:
 *     summary: Obtiene los movimientos de inventario de un producto específico
 *     tags: [Inventario]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del producto
 *     responses:
 *       200:
 *         description: Movimientos de inventario del producto
 */
router.get('/producto/:id', validarToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const movimientos = await service.findOne(id);
    res.json(movimientos);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/v1/inventario:
 *   post:
 *     summary: Registra un nuevo movimiento de inventario
 *     tags: [Inventario]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               producto_id:
 *                 type: integer
 *               tipo_movimiento:
 *                 type: string
 *                 enum: [entrada, salida]
 *               cantidad:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Movimiento registrado exitosamente
 */
router.post('/', validarToken, async (req, res, next) => {
  try {
    const movimiento = req.body;
    const nuevoMovimiento = await service.create(movimiento);
    res.status(201).json(nuevoMovimiento);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/v1/inventario/stock-bajo:
 *   get:
 *     summary: Obtiene productos con stock bajo
 *     tags: [Inventario]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limite
 *         schema:
 *           type: integer
 *         description: Límite de stock para considerar bajo
 *     responses:
 *       200:
 *         description: Lista de productos con stock bajo
 */
router.get('/stock-bajo', validarToken, async (req, res, next) => {
  try {
    const { limite = 10 } = req.query;
    const productos = await service.getProductosStockBajo(parseInt(limite));
    res.json(productos);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/v1/inventario/producto/{id}:
 *   patch:
 *     summary: Actualiza el stock de un producto
 *     tags: [Inventario]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del producto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               stock:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Stock actualizado exitosamente
 */
router.patch('/producto/:id', validarToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { stock } = req.body;
    const producto = await service.updateInventario(id, { stock });
    res.json(producto);
  } catch (error) {
    next(error);
  }
});

export default router;

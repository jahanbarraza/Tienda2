import {Router} from 'express';
import { ProductoService } from '../services/productoService.js';
import { validatorHandler } from '../middlewares/validator.handler.js'
import {createProductoSchema, getProductoSchema, updateProductoSchema } from '../schemas/productoSchema.js'


const router = Router();

const servicio = new ProductoService();

router.get('/', async(req, res) => {
  const producto = await servicio.find();
  res.json(producto)
})

router.get('/:id',
  validatorHandler(getProductoSchema, 'params'),
  async(req, res, next) => {
    try {
      const {id} = req.params;
      const producto = await servicio.findOne(id);
      res.json(producto)
    } catch (error) {
      next(error)
    }
})

router.post('/',
  validatorHandler(createProductoSchema, 'body'),
  async(req, res, next) => {
    try {
      const body = req.body;
      const newProducto = await servicio.create(body);
      res.status(201).json(newProducto)
    } catch (error) {
      next(error)
    }
})

router.patch('/:id',
  validatorHandler(getProductoSchema, 'params'),
  validatorHandler(updateProductoSchema, 'body'),
  async(req, res,next)=> {
    try {
      const {id} = req.params;
      const data = req.body;
      const producto = await servicio.update(id, data)
      res.json(producto)
    } catch (error) {
      next(error)
    }
  });

  router.delete('/:id',
    validatorHandler(getProductoSchema, 'params'),
    async(req, res, next)=> {
      try {
        const { id } = { ...req.params };
        const producto = await servicio.delete(id);
        res.json({ ...producto, msj : 'Producto Eliminado'})
      } catch (error) {
        next(error)
      }
    }
  )


export default router ;

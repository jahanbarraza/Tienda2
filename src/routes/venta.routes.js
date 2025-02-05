import { Router } from 'express'
import { VentaService } from '../services/ventaService.js'
import {validatorHandler} from '../middlewares/validator.handler.js'
import {createVentaSchema, getVentaSchema, updateVentaSchema} from '../schemas/ventaSchema.js'

const router = Router();

const servicio = new VentaService();

router.get('/', async(req, res) =>{
  const venta = await servicio.find();
  res.json(venta)
});

router.get('/:id',
  validatorHandler(getVentaSchema, 'params'),
  async( req, res, next ) => {
    try {
      const {id} = req.params
      const venta = await servicio.findOne(id)
      res.json(venta)
    } catch (error) {
      next(error)
    }
  }
);

router.post('/',
  validatorHandler(createVentaSchema, 'body'),
  async(req, res, next ) => {
    try {
      const body = req.body
      const venta = await servicio.create(body);
      res.status(201).json(venta)
    } catch (error) {
      next(error)
    }
  }
 )

 router.patch('/:id',
  validatorHandler(getVentaSchema, 'params'),
  validatorHandler(updateVentaSchema, 'body'),
  async(req, res, next ) => {
    try {
      const {id} = req.params;
      const data = req.body;
      const venta = await servicio.update(id, data)
      res.json(venta)
    } catch (error) {
      next(error)
    }
  }
 )

 router.delete('/:id',
  validatorHandler(getVentaSchema, 'params'),
  async(req,res,next) => {
    try {
      const {id} = req.params;
      const venta= await servicio.delete(id)
      res.send('Producto Eliminado')
    } catch (error) {
      next(error)
    }
  }
 )

 export default router;

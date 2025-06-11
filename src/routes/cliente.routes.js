import { Router } from 'express';
import { ClienteService } from '../services/clienteService.js'
import {createClienteSchema, getClienteSchema, updateClienteSchema} from '../schemas/clienteSchema.js'
import { validatorHandler } from '../middlewares/validator.handler.js'


const router = Router();

const servicio = new ClienteService();

router.get('/', async(req, res) => {
  const cliente = await servicio.find();
  res.json(cliente)
});

router.get('/:id',
  validatorHandler(getClienteSchema, 'params'),
  async(req, res, next) => {
    try {
      const {id} = req.params
      const cliente = await servicio.findOne(id)
      res.json(cliente)
    } catch (error) {
      next(error)
    }
  }
);

router.post('/',
  validatorHandler(createClienteSchema, 'body'),
  async(req, res, next) => {
    try {
      const body = req.body
      const newCliente = await servicio.create(body)
      res.status(201).json(newCliente)
    } catch (error) {
      next(error)
    }
  }
);

router.patch('/:id',
  validatorHandler(getClienteSchema, 'params'),
  validatorHandler(updateClienteSchema, 'body'),
  async(req, res, next) => {
    try {
      const {id} = req.params
      const data = req.body
      const cliente = await servicio.update(id, data)
      res.json(cliente)
    } catch (error) {
      next(error)
    }
  }
);

router.delete('/:id',
  validatorHandler(getClienteSchema),
  async(req, res, next) => {
    try {
      const {id} = req.params
      const cliente = await servicio.delete(id)
      res.send(`Cliente Eliminado ${id}` )
    } catch (error) {
      next(error)
    }
  }
)




export default router;

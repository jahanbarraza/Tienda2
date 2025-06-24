import {Router} from 'express';
import { validatorHandler } from '../middlewares/validator.handler.js'
import {CategoriaService} from '../services/categoriaService.js'
import { getCategoriaSchema, createCategoriaSchema, updateCategoriaSchema} from '../schemas/categoriaSchema.js'

const router = Router();

const servicio = new CategoriaService();

router.get('/', async(req, res) => {
  const categorias = await servicio.find();
  res.json(categorias)
});

router.get('/:id',
  validatorHandler(getCategoriaSchema, 'params'),
  async(req, res, next) => {
    try {
      const {id} = req.params
      const categoria = await servicio.findOne(id)
      res.json(categoria)
    } catch (error) {
      next(error)
    }
  }
)

router.post('/',
  validatorHandler(createCategoriaSchema, 'body'),
  async(req, res, next) => {
    try {
      const body = req.body;
      const newCategoria = await servicio.create(body)
      res.status(201).json(newCategoria)
    } catch (error) {
      next(error)
    }
  }
);

router.patch('/:id',
  validatorHandler(getCategoriaSchema, 'params'),
  validatorHandler(updateCategoriaSchema, 'body'),
  async(req, res, next) => {
    try {
      const {id} = req.params;
      const data = req.body;
      const categoria = await servicio.update(id, data)
      res.json(categoria)
    } catch (error) {
      next(error)
    }
  }
);

router.delete('/:id',
  validatorHandler(getCategoriaSchema, 'params'),
  async(req, res, next)=> {
    try {
      const {id} = req.params;
      const categoria = await servicio.delete(id)
      res.json({ msj : 'Categoría Eliminada'})
    } catch (error) {
      next(error)
    }
  }
)

export default router;

import {Router} from 'express';
import { UsuarioService } from '../services/usuarioService.js';
import { validatorHandler } from '../middlewares/validator.handler.js'
import {getUsuarioSchema, createUsuarioSchema, updateUsuarioSchema } from '../schemas/usuarioSchema.js'

const router = Router();

const servicio = new UsuarioService();

router.get('/', async(req, res)=>{
  const usuarios = await servicio.find();
  res.json(usuarios)
} );

router.get('/:id',
  validatorHandler(getUsuarioSchema, 'params'),
  async(req, res, next) => {
    try {
      const {id} = req.params
      const usuario = await servicio.findOne(id)
      res.json(usuario)
    } catch (error) {
      next (error)
    }
  }
);

router.post('/',
  validatorHandler(createUsuarioSchema, 'body'),
  async(req, res) => {
  const body = req.body;
  const newUsuario = await servicio.create(body)
  res.status(201).json(newUsuario)
});

router.patch('/:id',
  validatorHandler(getUsuarioSchema, 'params'),
  validatorHandler(updateUsuarioSchema, 'body'),
  async(req, res, next) => {
  try {
    const {id} = req.params;
    const data = req.body;
    const usuario = await servicio.update(id, data)
    res.json(usuario)
  } catch (error) {
    next (error)
  }
});

router.delete('/:id',
  validatorHandler(getUsuarioSchema, 'params'),
  async( req, res, next) => {
    try {
      const {id} = req.params;
      const usuario = await servicio.delete(id)
      res.send('Usuario Eliminado')
    } catch (error) {
      next(error)
  }

});

export default router ;

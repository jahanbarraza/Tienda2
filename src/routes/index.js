import {Router} from 'express';
import usuarios from './usuario.routes.js';
import categorias from './categoria.routes.js';


function routerApi(app) {
  const router = Router();
  app.use('/api/v1', router)
  router.use('/usuarios', usuarios)
  router.use('/categorias', categorias)
}

export default routerApi;

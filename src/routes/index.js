import {Router} from 'express';
import usuarios from './usuario.routes.js';
import categorias from './categoria.routes.js';
import productos from './producto.routes.js';
import clientes from './cliente.routes.js';
import ventas from './venta.routes.js'
import detalle_venta from './detalle_venta.routes.js'
import auth from './auth.routes.js'


function routerApi(app) {
  const router = Router();
  app.use('/api/v1', router)

  router.use('/auth', auth)
  router.use('/usuarios', usuarios)
  router.use('/categorias', categorias)
  router.use('/productos', productos)
  router.use('/clientes', clientes)
  router.use('/ventas', ventas)
  router.use('/detalle_venta', detalle_venta)
}

export default routerApi;

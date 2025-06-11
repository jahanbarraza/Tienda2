import {config}  from './src/config.js'
import express from 'express'
import cors from 'cors'

import routerApi from './src/routes/index.js'
import {logErrors, boomErrorHandler, errorHandler} from './src/middlewares/error.handler.js'

const app = express();
const port = process.env.PORT || 3000;

// Configurar CORS para permitir conexiones desde cualquier origen
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

routerApi(app);

app.use(logErrors);
app.use(boomErrorHandler);
app.use(errorHandler)

app.listen(port, '0.0.0.0', () => {
  console.log(`Mi Server Corriendo en el puerto ${port}`)
})

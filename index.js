import {config}  from './src/config.js'
import express from 'express'

import routerApi from './src/routes/index.js'
import {logErrors, boomErrorHandler, errorHandler} from './src/middlewares/error.handler.js'

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

routerApi(app);

app.use(logErrors);
app.use(boomErrorHandler);
app.use(errorHandler)

app.listen(port, () => {
  console.log(`Mi Server Corriendo en el puerto ${port}`)
})

import { Router } from 'express'
import { DetalleVentaService } from '../services/detalle_ventaService.js'
import { validatorHandler } from '../middlewares/validator.handler.js'
import { getDetalleVentaSchema, createProductoSchema} from '../schemas/detalle_ventaSchema.js'


const router = Router();

const servicio = new DetalleVentaService();

router.get('/:id',
    validatorHandler(getDetalleVentaSchema, 'params'),
    async(req, res, next) => {
        try {
            const {id} = req.params
            const detalle_venta = await servicio.findOne(id)
            res.json(detalle_venta)
        } catch (error) {
            next(error)
        }
    }
)

router.post('/', 
    validatorHandler(createProductoSchema, 'body'),
    async(req, res, next) => {
        try {
            const body = req.body
            const detalle_venta = await servicio.create(body)
            console.log(detalle_venta)
            res.status(201).json(detalle_venta)
        } catch (error) {
            next(error)
        }
    }
)

router.delete('/:id',
    validatorHandler(getDetalleVentaSchema, 'params'),
    async(req, res, next) => {
        try {
            const {id} = req.params
            const detalle_venta = await servicio.delete(id)
            res.send('Producto Elimindao de la venta')
        } catch (error) {
            next(error)
        }
    }
)

export default router;
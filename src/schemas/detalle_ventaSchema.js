import Joi from 'joi';

const id = Joi.number();
const venta_id = Joi.number();
const producto_id = Joi.number();
const cantidad = Joi.number();
const precio_unitario = Joi.number();

export const createProductoSchema = Joi.object({
    venta_id: venta_id.required(),
    producto_id: producto_id.required(),
    cantidad: cantidad.required(),
    precio_unitario: precio_unitario.required()
});

export const getDetalleVentaSchema = Joi.object({
    id: id.required()
});


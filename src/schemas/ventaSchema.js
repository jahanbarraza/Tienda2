import Joi from 'joi';


const id = Joi.number();
const usuario_id = Joi.number();
const cliente_id = Joi.number();
const total = Joi.number().max(10000000);

export const createVentaSchema = Joi.object({
  usuario_id: usuario_id.required(),
  cliente_id: cliente_id.required(),
  total: total,
  productos: Joi.array().items(
    Joi.object({
      producto_id: Joi.number().required(),
      cantidad: Joi.number().required(),
      precio_unitario: Joi.number().required()
    })
  ).required()
});

export const updateVentaSchema = Joi.object({
  usuario_id: usuario_id,
  cliente_id: cliente_id,
  total: total
});

export const getVentaSchema = Joi.object({
  id: id.required()
});

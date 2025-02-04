import Joi from 'joi';

const id = Joi.number();
const nombre = Joi.string().min(3).max(20);
const descripcion = Joi.string().min(3).max(50);
const precio = Joi.number().min(3).max(10000000);
const stock = Joi.number().min(1).max(10000);
const categoria_id = Joi.number();
const codigo_barra= Joi.string().min(3).max(25);

export const createProductoSchema = Joi.object({
  nombre: nombre.required(),
  descripcion: descripcion.required(),
  precio: precio.required(),
  stock: stock.required(),
  categoria_id: categoria_id.required(),
  codigo_barra: codigo_barra

});


export const updateProductoSchema = Joi.object({
  nombre: nombre,
  descripcion: descripcion,
  precio: precio,
  stock: stock,
  categoria_id: categoria_id,
  codigo_barra: codigo_barra
});

export const getProductoSchema = Joi.object({
  id: id.required()
});

import Joi from 'joi';

const id = Joi.number();
const nombre = Joi.string().min(3).max(25);
const descripcion = Joi.string().min(3).max(150);

export const createCategoriaSchema = Joi.object({
  nombre: nombre.required(),
  descripcion: descripcion.required()
});

export const updateCategoriaSchema = Joi.object({
  nombre: nombre,
  descripcion: descripcion
});

export const getCategoriaSchema = Joi.object({
  id: id.required()
});


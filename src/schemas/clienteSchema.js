import Joi from 'joi';

const id = Joi.number();
const nombre = Joi.string().min(3).max(20);
const apellido = Joi.string().min(3).max(20);
const email = Joi.string().email();
const telefono = Joi.number().max(10);
const direccion = Joi.string();

export const createClienteSchema = Joi.object({
  nombre: nombre.required(),
  apellido: apellido.required(),
  email: email.required(),
  telefono: telefono.required(),
  direccion: direccion.required()
});

export const updateClienteSchema = Joi.object({
  nombre: nombre,
  apellido: apellido,
  email: email,
  telefono: telefono,
  direccion: direccion
});

export const getClienteSchema = Joi.object({
  id: id.required()
})

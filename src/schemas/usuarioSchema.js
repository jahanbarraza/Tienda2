import Joi from 'joi';

const id = Joi.number();
const nombre = Joi.string().min(3).max(20);
const apellido = Joi.string().min(3).max(15);
const email = Joi.string().email();
const telefono = Joi.string().min(3).max(15);
const contrasena = Joi.string().min(3).max(20);
const rol = Joi.string().min(3).max(15);

export const createUsuarioSchema = Joi.object({
  nombre: nombre.required(),
  apellido: apellido.required(),
  email: email.required(),
  telefono: telefono,
  contrasena: contrasena.required(),
  rol: rol.required()
});

export const updateUsuarioSchema = Joi.object({
  nombre: nombre,
  apellido: apellido,
  email: email,
  telefono: telefono,
  contrasena: contrasena,
  rol: rol
});

export const getUsuarioSchema = Joi.object({
  id: id.required()
});


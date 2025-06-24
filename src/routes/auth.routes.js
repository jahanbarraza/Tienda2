// Ruta de autenticación simple para el login
import { Router } from 'express';
import { UsuarioService } from '../services/usuarioService.js';

const router = Router();
const usuarioService = new UsuarioService();

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email y contraseña son requeridos'
      });
    }

    // Buscar usuario por email
    const usuarios = await usuarioService.find();
    const usuario = usuarios.find(u => u.email === email);
    
    if (!usuario) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Verificar contraseña (en un caso real debería estar hasheada)
    if (usuario.contrasena !== password) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Login exitoso
    const userData = {
      id: usuario.usuario_id,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol,
      token: 'fake-jwt-token-' + usuario.usuario_id // Token simulado
    };

    res.json({
      success: true,
      data: userData,
      message: 'Login exitoso'
    });

  } catch (error) {
    next(error);
  }
});

export default router;


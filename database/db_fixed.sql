-- Crear tabla categorias primero
CREATE TABLE categorias (
    categoria_id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    fecha_creacion TIMESTAMP DEFAULT NOW()
);

-- Crear tabla usuarios
CREATE TABLE usuarios (
    usuario_id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    telefono VARCHAR(20),
    contraseña TEXT NOT NULL,
    rol VARCHAR(50) CHECK (rol IN ('admin', 'vendedor', 'cliente')) NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT NOW()
);

-- Crear tabla productos
CREATE TABLE productos (
    producto_id SERIAL PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL UNIQUE,
    descripcion TEXT,
    precio NUMERIC(10, 2) NOT NULL,
    stock INT DEFAULT 0 NOT NULL,
    codigo_barra VARCHAR(50) UNIQUE,
    fecha_creacion TIMESTAMP DEFAULT NOW(),
    categoria_id INT REFERENCES categorias(categoria_id) ON DELETE SET NULL
);

-- Crear tabla clientes
CREATE TABLE clientes (
    cliente_id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100),
    email VARCHAR(150) UNIQUE,
    telefono VARCHAR(20),
    direccion TEXT,
    fecha_creacion TIMESTAMP DEFAULT NOW()
);

-- Crear tabla ventas
CREATE TABLE ventas (
    venta_id SERIAL PRIMARY KEY,
    usuario_id INT REFERENCES usuarios(usuario_id) ON DELETE SET NULL,
    cliente_id INT REFERENCES clientes(cliente_id) ON DELETE SET NULL,
    fecha TIMESTAMP DEFAULT NOW(),
    total DECIMAL(10,2) NOT NULL
);

-- Crear tabla detalle_ventas
CREATE TABLE detalle_ventas (
    detalle_id SERIAL PRIMARY KEY,
    venta_id INT REFERENCES ventas(venta_id) ON DELETE CASCADE,
    producto_id INT REFERENCES productos(producto_id) ON DELETE CASCADE,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL
);

-- Insertar datos de ejemplo
INSERT INTO categorias (nombre, descripcion) VALUES 
('Electrónicos', 'Productos electrónicos y tecnológicos'),
('Ropa', 'Vestimenta y accesorios'),
('Hogar', 'Artículos para el hogar');

INSERT INTO usuarios (nombre, apellido, email, contraseña, rol) VALUES 
('Admin', 'Sistema', 'admin@tienda.com', 'admin123', 'admin'),
('Juan', 'Vendedor', 'vendedor@tienda.com', 'vendedor123', 'vendedor');

INSERT INTO productos (nombre, descripcion, precio, stock, codigo_barra, categoria_id) VALUES 
('Laptop HP Pavilion', 'Laptop HP Pavilion 15.6" Intel Core i5', 2500000, 15, '123456789', 1),
('Mouse Logitech MX', 'Mouse inalámbrico Logitech MX Master 3', 350000, 25, '987654321', 1),
('Teclado Mecánico', 'Teclado mecánico RGB para gaming', 450000, 10, '456789123', 1);

INSERT INTO clientes (nombre, apellido, email, telefono, direccion) VALUES 
('María', 'García', 'maria@email.com', '3001234567', 'Calle 123 #45-67'),
('Carlos', 'López', 'carlos@email.com', '3007654321', 'Carrera 89 #12-34');


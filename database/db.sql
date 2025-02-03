CREATE TABLE usuarios (
    usuario_id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    telefono VARCHAR(20),
    contraseña TEXT NOT NULL,
    rol VARCHAR(50) CHECK (rol IN ('admin', 'vendedor')) NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT NOW()
);

CREATE TABLE productos (
    producto_id SERIAL PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    categoria VARCHAR(100),
    codigo_barra VARCHAR(50) UNIQUE,
    fecha_creacion TIMESTAMP DEFAULT NOW()
);

CREATE TABLE clientes (
    cliente_id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100),
    email VARCHAR(150) UNIQUE,
    telefono VARCHAR(20),
    direccion TEXT,
    fecha_creacion TIMESTAMP DEFAULT NOW()
);

CREATE TABLE ventas (
    venta_id SERIAL PRIMARY KEY,
    usuario_id INT REFERENCES usuarios(usuario_id) ON DELETE SET NULL,
    cliente_id INT REFERENCES clientes(cliente_id) ON DELETE SET NULL,
    fecha TIMESTAMP DEFAULT NOW(),
    total DECIMAL(10,2) NOT NULL
);

CREATE TABLE detalle_ventas (
    detalle_id SERIAL PRIMARY KEY,
    venta_id INT REFERENCES ventas(venta_id) ON DELETE CASCADE,
    producto_id INT REFERENCES productos(producto_id) ON DELETE CASCADE,
    cantidad INT NOT NULL CHECK (cantidad > 0),
    precio_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL
);

CREATE TABLE pagos (
    pago_id SERIAL PRIMARY KEY,
    venta_id INT REFERENCES ventas(venta_id) ON DELETE CASCADE,
    metodo_pago VARCHAR(50) CHECK (metodo_pago IN ('efectivo', 'tarjeta', 'transferencia')),
    monto DECIMAL(10,2) NOT NULL,
    fecha TIMESTAMP DEFAULT NOW()
);

CREATE TABLE inventario (
    inventario_id SERIAL PRIMARY KEY,
    producto_id INT REFERENCES productos(producto_id) ON DELETE CASCADE,
    tipo_movimiento VARCHAR(50) CHECK (tipo_movimiento IN ('entrada', 'salida')),
    cantidad INT NOT NULL CHECK (cantidad > 0),
    fecha TIMESTAMP DEFAULT NOW(),
    usuario_id INT REFERENCES usuarios(usuario_id) ON DELETE SET NULL
);

CREATE TABLE categorias (
    categoria_id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) UNIQUE NOT NULL,
    descripcion TEXT,
    fecha_creacion TIMESTAMP DEFAULT NOW()
);

ALTER TABLE productos
ADD COLUMN categoria_id INT REFERENCES categorias(categoria_id) ON DELETE SET NULL;

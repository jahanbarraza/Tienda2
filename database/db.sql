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

CREATE TABLE public.productos (
	producto_id serial4 NOT NULL,
	nombre varchar(200) NOT NULL,
	descripcion text NULL,
	precio numeric(10, 2) NOT NULL,
	stock int4 DEFAULT 0 NOT NULL,
	codigo_barra varchar(50) NULL,
	fecha_creacion timestamp DEFAULT now() NULL,
	categoria_id int4 NULL,
	CONSTRAINT productos_codigo_barra_key UNIQUE (codigo_barra),
	CONSTRAINT productos_pkey PRIMARY KEY (producto_id),
	CONSTRAINT productos_unique UNIQUE (nombre),
	CONSTRAINT productos_categoria_id_fkey FOREIGN KEY (categoria_id) REFERENCES public.categorias(categoria_id) ON DELETE SET NULL
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

CREATE TABLE public.detalle_ventas (
	detalle_id serial4 NOT NULL,
	venta_id int4 NULL,
	producto_id int4 NULL,
	cantidad int4 NOT NULL,
	precio_unitario numeric(10, 2) NOT NULL,
	CONSTRAINT detalle_ventas_cantidad_check CHECK ((cantidad > 0)),
	CONSTRAINT detalle_ventas_pkey PRIMARY KEY (detalle_id),
	CONSTRAINT detalle_ventas_producto_id_fkey FOREIGN KEY (producto_id) REFERENCES public.productos(producto_id) ON DELETE CASCADE,
	CONSTRAINT detalle_ventas_venta_id_fkey FOREIGN KEY (venta_id) REFERENCES public.ventas(venta_id) ON DELETE CASCADE
);

CREATE TABLE pagos (
    pago_id SERIAL PRIMARY KEY,
    venta_id INT REFERENCES ventas(venta_id) ON DELETE CASCADE,
    metodo_pago VARCHAR(50) CHECK (metodo_pago IN ('efectivo', 'tarjeta', 'transferencia')),
    monto DECIMAL(10,2) NOT NULL,
    fecha TIMESTAMP DEFAULT NOW()
);

CREATE TABLE public.inventario (
	inventario_id serial4 NOT NULL,
	producto_id int4 NULL,
	tipo_movimiento varchar(50) NULL,
	cantidad int4 NOT NULL,
	fecha timestamp DEFAULT now() NULL,
	CONSTRAINT inventario_cantidad_check CHECK ((cantidad > 0)),
	CONSTRAINT inventario_pkey PRIMARY KEY (inventario_id),
	CONSTRAINT inventario_tipo_movimiento_check CHECK (((tipo_movimiento)::text = ANY ((ARRAY['entrada'::character varying, 'salida'::character varying])::text[]))),
	CONSTRAINT inventario_producto_id_fkey FOREIGN KEY (producto_id) REFERENCES public.productos(producto_id) ON DELETE CASCADE
);

CREATE TABLE categorias (
    categoria_id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) UNIQUE NOT NULL,
    descripcion TEXT,
    fecha_creacion TIMESTAMP DEFAULT NOW()
);

ALTER TABLE productos
ADD COLUMN categoria_id INT REFERENCES categorias(categoria_id) ON DELETE SET NULL;


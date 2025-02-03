import pg from 'pg';

export const pool = new pg.Pool({
    user: "postgres",
    host: "localhost",
    password: "Postgres123",
    database: "tienda",
    port: "5432"
});


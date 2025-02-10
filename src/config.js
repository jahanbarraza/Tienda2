import dotenv from 'dotenv'
dotenv.config();

export const config = {
  PORT: process.env.PORT || 3000,
  DB_PORT: process.env.DB_PORT,
  DB_USER: process.env.DB_USER,
  DB_HOST: process.env.DB_HOST,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_DATABASE: process.env.DB_DATABASE
  
}

import dotenv from 'dotenv';

dotenv.config();

import mysql, { Pool } from 'mysql2/promise';

const db: Pool = mysql.createPool({
  host: process.env.DB_HOST!,
  user: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
  database: process.env.DB_DATABASE!,
});

export default db;

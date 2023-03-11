import { Pool } from "pg";

const pgConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
};

const pool: Pool = new Pool(pgConfig);

export default pool;
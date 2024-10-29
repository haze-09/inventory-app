import pkg from "pg";
const { Pool } = pkg;

const isLocal = process.env.LOCAL === 'true';


export default new Pool({
    connectionString: isLocal ? process.env.EXTERNAL_DB_URL : process.env.INTERNAL_DB_URL,
    ssl: {
        rejectUnauthorized: false,
      },
})
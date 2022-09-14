import pool from "../../../db/dbConfig";

export const resolvers = {
    Query: {
         users: async () => {
            const { rows } = await pool.query("SELECT * FROM user_login");
           return [...rows];
        }
    },
};
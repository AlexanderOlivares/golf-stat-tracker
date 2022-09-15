import pool from "../../../db/dbConfig";

export const resolvers = {
    Query: {
         users: async () => {
            const { rows } = await pool.query("SELECT * FROM user_login");
           return [...rows];
        },
         user: async (userid: string) => {
            const { rows } = await pool.query("SELECT * FROM user_login WHERE userid = $1", [userid]);
            console.log(rows);
           return {...rows[0]}
        }
    },
};
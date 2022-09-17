import pool from "../../../db/dbConfig";
import registerUser from "../../../lib/user/register";
import loginUser from "../../../lib/user/login";
import { setAuthCookie, removeAuthCookie } from "../../../lib/auth-cookie";

export const resolvers = {
  Query: {
    users: async () => {
      const { rows } = await pool.query("SELECT * FROM user_login");
      return [...rows];
    },
    user: async (userid: string) => {
      const { rows } = await pool.query(
        "SELECT * FROM user_login WHERE userid = $1",
        [userid]
      );
      console.log(rows);
      return { ...rows[0] };
    },
  },
  Mutation: {
    register: async (_parent: any, args: any, context: any, _info: any) => {
      const { username, email, password } = args.input;

      const user = await registerUser(username, email, password);
      console.log(user);
      const { token } = user;

      if (!token) return new Error(user.message);

      setAuthCookie(context.res, token);

      return user;
    },
    login: async (_parent: any, args: any, context: any, _info: any) => {
      const { email, password } = args.input;

      const user = await loginUser(email, password);
      console.log(user);
      const { token } = user;

      if (!token) return new Error(user.message);

      setAuthCookie(context.res, token);

      return user;
    },
    async signOut(_parent:any, _args:any, context:any, _info:any) {
        removeAuthCookie(context.res)
        return true
      },

  },
};

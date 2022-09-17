import pool from "../../../db/dbConfig";
import registerUser from "../../../lib/user/register";
import cookie from "cookie";

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

      context.res.setHeader(
        "Set-Cookie",
        cookie.serialize("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV !== "development",
          maxAge: 60 * 60 * 24 * 7, // 1 week
          sameSite: "strict",
          path: "/",
        })
      );

      return user;
    },
  },
};

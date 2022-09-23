import registerUser from "../../../lib/user/register";
import loginUser from "../../../lib/user/login";
import { getUser, getUsers } from "../../../lib/user/getUsers";
import { setAuthCookie, removeAuthCookie } from "../../../lib/auth-cookie";

export const resolvers = {
  Query: {
    users: async () => {
      return await getUsers();
    },
    user: async (_parent: any, args: any, context: any, _info: any) => {
      const { username } = args;
      return await getUser(username);
    },
  },
  Mutation: {
    register: async (_parent: any, args: any, context: any, _info: any) => {
      const { username, email, password } = args.input;

      const user = await registerUser(username, email, password);
      const { token } = user;

      if (!token) return new Error(user.message);

      setAuthCookie(context.res, token);

      return user;
    },
    login: async (_parent: any, args: any, context: any, _info: any) => {
      const { email, password } = args.input;

      const user = await loginUser(email, password);
      const { token } = user;

      if (!token) return new Error(user.message);

      setAuthCookie(context.res, token);

      return user;
    },
    async signOut(_parent: any, _args: any, context: any, _info: any) {
      removeAuthCookie(context.res);
      return true;
    },
  },
};

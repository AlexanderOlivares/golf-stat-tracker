import registerUser from "../../../lib/user/register";
import loginUser from "../../../lib/user/login";
import { getUser, getUsers } from "../../../lib/user/getUsers";
import { setAuthCookie, removeAuthCookie, validateAuthCookie } from "../../../lib/auth-cookie";
import { getAllCourses, searchCourses } from "../../../lib/course/searchCourses";
import {
  IUserQueryArgs,
  IRegisterMutationArgs,
  ILoginMutationArgs,
  IContext,
  ICourseSearchQueryArgs,
} from "./resolverInterfaces";
import { errorOccured } from "./graphqlUtils";

export const resolvers = {
  Query: {
    users: async () => {
      return await getUsers();
    },
    user: async (_parent: undefined, args: IUserQueryArgs, _context: IContext) => {
      const { username } = args;
      return await getUser(username);
    },
    token: async (_parent: undefined, args: IUserQueryArgs, context: IContext) => {
      const token = await validateAuthCookie(context.req);
      if (errorOccured(token)) return new Error(token.errorMessage);
      return token;
    },
    // not using but keeping for git
    courseSearchResults: async (_parent: undefined, args: ICourseSearchQueryArgs, _context: IContext) => {
      const { courseName } = args;
      let res = await searchCourses(courseName);
      return;
    },
    getAllCourses: async () => {
      const courses = await getAllCourses();
      if (errorOccured(courses)) return new Error(courses.errorMessage);
      return courses;
    },
  },
  Mutation: {
    register: async (_parent: undefined, args: IRegisterMutationArgs, context: IContext) => {
      const { username, email, password } = args.input;

      const registeredUser = await registerUser(username, email, password);

      if (errorOccured(registeredUser)) return new Error(registeredUser.errorMessage);

      const { token } = registeredUser;

      setAuthCookie(context.res, token);

      return registeredUser;
    },
    login: async (_parent: undefined, args: ILoginMutationArgs, context: IContext) => {
      const { email, password } = args.input;

      const loggedInUser = await loginUser(email, password);

      if (errorOccured(loggedInUser)) return new Error(loggedInUser.errorMessage);

      const { token } = loggedInUser;

      setAuthCookie(context.res, token);

      return loggedInUser;
    },
    async signOut(_parent: undefined, _args: undefined, context: IContext) {
      removeAuthCookie(context.res);
      return true;
    },
  },
};

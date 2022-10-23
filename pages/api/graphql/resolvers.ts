import registerUser, { IErrorMessage } from "../../../lib/user/register";
import loginUser from "../../../lib/user/login";
import { getUser } from "../../../lib/user/getUsers";
import { setAuthCookie, removeAuthCookie } from "../../../lib/auth-cookie";
import { getCourseNamesAndIds, getCourseForNewRound } from "../../../lib/course/searchCourses";
import {
  IUserQueryArgs,
  IRegisterMutationArgs,
  ILoginMutationArgs,
  IContext,
  INewRoundMutationArgs,
} from "./resolverInterfaces";
import { errorOccured } from "./graphqlUtils";
import { createNewRound } from "../../../lib/round/createNewRound";
import { INewRound } from "../../[username]/round/new-round";

export const resolvers = {
  Query: {
    user: async (_parent: undefined, args: IUserQueryArgs, _context: IContext) => {
      const { username } = args;
      return await getUser(username);
    },
    courses: async () => {
      const courseNamesAndIds = await getCourseNamesAndIds();
      if (errorOccured(courseNamesAndIds)) return new Error(courseNamesAndIds.errorMessage);
      return courseNamesAndIds;
    },
    course: async (_parent: undefined, args: any, context: IContext) => {
      if (errorOccured(context.token)) return new Error(context.token.errorMessage);
      const { courseId, teeColor } = args;
      const course = await getCourseForNewRound(courseId, teeColor);
      if (errorOccured(course)) return new Error(course.errorMessage);
      return course;
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
    async newRound(_parent: undefined, args: INewRoundMutationArgs, _context: IContext) {
        const { input } = args
        const round = await createNewRound(input);
        if (errorOccured(round)) return new Error(round.errorMessage)
        return round;
    },
  },
};

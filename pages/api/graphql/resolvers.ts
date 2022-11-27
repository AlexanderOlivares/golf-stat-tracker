import registerUser from "../../../lib/user/register";
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
  IRoundQueryArgs, 
  ICourseQueryArgs,
  IEditClubsMutationArgs,
  IUpdateUserAddedParArgs,
} from "./resolverInterfaces";
import { errorOccured } from "./graphqlUtils";
import { createNewRound, getRound } from "../../../lib/round/createNewRound";
import { getUserClubs, updateUserClubs } from "../../../lib/user/getUserClubs";
import { saveRoundDetails } from "../../../lib/round/updateRound";
import { getRoundPreview } from "../../../lib/round/roundPreview";
import { createUnverifiedCourse } from "../../../lib/course/createUnverifiedCourse";
import { getUnverifiedCourse } from "../../../lib/course/getCourse";
import { updateUnverifiedCoursePar } from "../../../lib/course/updateUnverifiedCoursePar";

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
    course: async (_parent: undefined, args: ICourseQueryArgs, context: IContext) => {
      if (errorOccured(context.token)) return new Error(context.token.errorMessage);
      const { courseId } = args;
      const course = await getCourseForNewRound(courseId);
      if (errorOccured(course)) return new Error(course.errorMessage);
      return course;
    },
    unverifiedCourse: async (_parent: undefined, args: {unverifiedCourseId: string}, context: IContext) => {
      if (errorOccured(context.token)) return new Error(context.token.errorMessage);
      const { unverifiedCourseId } = args;
      const unverifiedCourse = await getUnverifiedCourse(unverifiedCourseId);
      if (errorOccured(unverifiedCourse)) return new Error(unverifiedCourse.errorMessage);
      return unverifiedCourse;
    },
    round: async (_parent: undefined, args: IRoundQueryArgs, context: IContext) => {
      if (errorOccured(context.token)) return new Error(context.token.errorMessage);
      const { roundid } = args;
      const round = await getRound(roundid);
      if (errorOccured(round)) return new Error(round.errorMessage);
      return round;
    },
    roundPreview: async (_parent: undefined, args: { username: string }, context: IContext) => {
      if (errorOccured(context.token)) return new Error(context.token.errorMessage);
      const { username } = args;
      const round = await getRoundPreview(username);
      if (errorOccured(round)) return new Error(round.errorMessage);
      return round;
    },
    clubs: async (_parent: undefined, args: { username: string }, context: IContext) => {
      if (errorOccured(context.token)) return new Error(context.token.errorMessage);
        const { username } = args;
        const clubs = await getUserClubs(username)
        if (errorOccured(clubs)) return new Error(clubs.errorMessage);
        return clubs
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
        if (input.unverifiedCourseId) {
            const unverifiedCourse = await createUnverifiedCourse(input);
            if (errorOccured(unverifiedCourse)) return new Error(unverifiedCourse.errorMessage)
        }
        const round = await createNewRound(input);
        if (errorOccured(round)) return new Error(round.errorMessage)
        return round;
    },
    async editClubs(_parent: undefined, args: IEditClubsMutationArgs, context: IContext) {
      if (errorOccured(context.token)) return new Error(context.token.errorMessage);
        const { username, clubs } = args.input
        const updatedClubs = await updateUserClubs(clubs, username);
        if (errorOccured(updatedClubs)) return new Error(updatedClubs.errorMessage)
        return updatedClubs;
    },
    // TODO update args 
    async saveRound(_parent: undefined, args: any, context: IContext) {
      if (errorOccured(context.token)) return new Error(context.token.errorMessage);
        const { holeScores, holeShotDetails, roundid } = args.input
        const savedRoundStats = await saveRoundDetails(holeScores, holeShotDetails, roundid);
        if (errorOccured(savedRoundStats)) return new Error(savedRoundStats.errorMessage)
        return savedRoundStats;
    },
    async saveUnverifiedCoursePar(_parent: undefined, args: IUpdateUserAddedParArgs, context: IContext) {
        if (errorOccured(context.token)) return new Error(context.token.errorMessage);
          const { unverifiedCourseId, userAddedPar  } = args.input
          const unverifiedCoursePar = await updateUnverifiedCoursePar(unverifiedCourseId, userAddedPar);
          if (errorOccured(unverifiedCoursePar)) return new Error(unverifiedCoursePar.errorMessage)
          return unverifiedCoursePar;
      },
  },
};

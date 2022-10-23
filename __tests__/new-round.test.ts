import { isEmptyObject, validUserAddedCourseFields } from "../utils/formValidator";
import {
  populateUserAddedCourseFields,
  IUserAddedCourse,
} from "../pages/[username]/round/new-round";

test("check if object is empty", () => {
  expect(isEmptyObject({})).toEqual(true);
  expect(isEmptyObject({ key: "vale" })).toEqual(false);
});

test("check if user added course object has all valid properties", () => {
  expect(
    validUserAddedCourseFields({
      userAddedCourseName: "Some course CC",
      userAddedCity: "Dallas",
      userAddedState: "TX",
      unverifiedCourseId: "12345",
    })
  ).toEqual(true);
  expect(
    validUserAddedCourseFields({
      userAddedCourseName: "Some course CC",
      userAddedCity: "No state on this one",
      unverifiedCourseId: "12345",
    })
  ).toEqual(false);
  expect(
    validUserAddedCourseFields({
      userAddedCourseName: "Some course CC",
      userAddedCity: "Dallas",
      userAddedState: "TX",
    })
  ).toEqual(false);
  expect(validUserAddedCourseFields({})).toEqual(false);
});

test("should set uuid on user added course fields", () => {
  const validUserAddCourse: IUserAddedCourse = {
    userAddedCourseName: "Alex CC",
    userAddedCity: "Austin",
    userAddedState: "TX",
  };
  const validUserAddedCourseFields = populateUserAddedCourseFields(true, validUserAddCourse);
  expect(validUserAddedCourseFields.unverifiedCourseId).not.toEqual(null);
  expect(validUserAddedCourseFields.userAddedCity).not.toEqual("");
  expect(validUserAddedCourseFields.userAddedState).not.toEqual("");
  expect(validUserAddedCourseFields.userAddedCourseName).not.toEqual("");
});

test("should return empty strings and null uuid when not a user added course", () => {
  const validUserAddCourse: IUserAddedCourse = {
    userAddedCourseName: "",
    userAddedCity: "",
    userAddedState: "",
  };
  const validUserAddedCourseFields = populateUserAddedCourseFields(false, validUserAddCourse);
  expect(validUserAddedCourseFields.unverifiedCourseId).toEqual(null);
  expect(validUserAddedCourseFields.userAddedCity).toEqual("");
  expect(validUserAddedCourseFields.userAddedState).toEqual("");
  expect(validUserAddedCourseFields.userAddedCourseName).toEqual("");
});

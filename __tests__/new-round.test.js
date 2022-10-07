import { isEmptyObject, userAddedCourseObjectValidator } from "../utils/formValidator";

test("check if object is empty", () => {
  expect(isEmptyObject({})).toEqual(true);
  expect(isEmptyObject({ key: "vale" })).toEqual(false);
});

test("check if user added course object has all valid properties", () => {
  expect(
    userAddedCourseObjectValidator({
      userAddedCourseName: "Some course CC",
      userAddedCity: "Dallas",
      userAddedState: "TX",
      unverifiedCourseId: "12345",
    })
  ).toEqual(true);
  expect(
    userAddedCourseObjectValidator({
      userAddedCourseName: "Some course CC",
      userAddedCity: "No state on this one",
      unverifiedCourseId: "12345",
    })
  ).toEqual(false);
  expect(
    userAddedCourseObjectValidator({
      userAddedCourseName: "Some course CC",
      userAddedCity: "Dallas",
      userAddedState: "TX",
    })
  ).toEqual(false);
  expect(userAddedCourseObjectValidator({})).toEqual(false);
});

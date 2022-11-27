import { createEmptyParArray } from "../lib/course/createUnverifiedCourse";


test("empty par array creates 20 empty strings", () => {
    expect(createEmptyParArray().length).toEqual(20);
    expect(Array.isArray(createEmptyParArray())).toEqual(true);
    expect(createEmptyParArray()[0]).toEqual("");
  });
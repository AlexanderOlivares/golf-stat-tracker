import pool from "../../db/dbConfig";
import { IRoundRequestBody } from "../../pages/[username]/round/new-round";
import { errorMessage } from "../../utils/errorMessage";

export const createEmptyParArray = () => Array.from({ length: 20}, ()=> "");

export async function createUnverifiedCourse(newRoundArgs: IRoundRequestBody) {
  try {
    const { unverifiedCourseId, userAddedCourseName, userAddedCity, userAddedState } = newRoundArgs;

    const unverifiedCourse = await pool.query(
      "INSERT INTO unverified_courses (unverified_course_id, user_added_course_name, user_added_city, user_added_state, user_added_par, added_to_verified_courses) VALUES ($1, $2, $3, $4, $5, $6) RETURNING unverified_course_id",
      [unverifiedCourseId, userAddedCourseName, userAddedCity, userAddedState, createEmptyParArray(), false]
    );
    console.log(unverifiedCourse);

    if (!unverifiedCourse.rowCount) {
        return errorMessage("Error adding unverified course");
      }

    return;
  } catch (error) {
    console.log(error);
    return errorMessage("Error adding unverified course");
  }
}

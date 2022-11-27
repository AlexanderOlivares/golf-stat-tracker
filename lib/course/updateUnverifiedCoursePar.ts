import pool from "../../db/dbConfig";
import { errorMessage } from "../../utils/errorMessage";


export async function updateUnverifiedCoursePar(
  unverifiedCourseId: string,
  userAddedPar: string[]
) {
  try {
    const savedUserAddedPar = await pool.query(
      `UPDATE unverified_courses
            SET user_added_par = ($1)
            WHERE unverified_course_id = ($2)
            RETURNING user_added_par`,
      [userAddedPar, unverifiedCourseId]
    );

    if (!savedUserAddedPar.rowCount) {
      return errorMessage("Error adding par to unverified course");
    }

    return savedUserAddedPar.rows[0]
  } catch (error) {
    console.log(error);
    return errorMessage("Error adding par to unverified course");
  }
}

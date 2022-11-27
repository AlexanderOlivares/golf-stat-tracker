import pool from "../../db/dbConfig";
import { errorMessage } from "../../utils/errorMessage";

export async function getUnverifiedCourse(unverifiedCourseId: string) {
  try {
    const unverifiedCourse = await pool.query(
      `SELECT user_added_par  
                  FROM unverified_courses 
                  WHERE unverified_course_id = $1`,
      [unverifiedCourseId]
    );

    if (!unverifiedCourse.rowCount) return errorMessage("Error fetching course data");
    return [unverifiedCourse.rows[0]];
  } catch (error) {
    console.log(error);
    return errorMessage("Error fetching course data");
  }
}

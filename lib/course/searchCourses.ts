import pool from "../../db/dbConfig";
import { errorMessage } from "../user/register";

export async function getCourseNamesAndIds() {
  try {
    const { rows } = await pool.query("SELECT course_name, course_id FROM courses");
    return [...rows];
  } catch (error) {
    return errorMessage("Error fetching course names");
  }
}

export async function getCourseForNewRound(courseId: string) {
  try {
    const existingCourse = await pool.query(
      `SELECT *  
            FROM courses 
            WHERE course_id = $1`,
      [courseId]
    );

    if (!existingCourse.rowCount){
        return errorMessage("Error fetching course data");
    }

    return [existingCourse.rows[0]];
  } catch (error) {
    console.log(error);
    return errorMessage("Error fetching course data");
  }
}

import pool from "../../db/dbConfig";
import { errorMessage } from "../user/register";

// not using but keeping for git
export async function searchCourses(courseName: string) {
  try {
    const { rows } = await pool.query(
      "SELECT course_name, course_country, course_state, course_city FROM courses WHERE course_name ILIKE $1 LIMIT 7",
      [`${courseName}%`]
    );
    return [...rows];
  } catch (error) {
    return errorMessage("Error searching course names")
  }
}

export async function getAllCourses() {
    try {
    const { rows } = await pool.query(
        "SELECT course_name FROM courses",
      );
      return [...rows];
    } catch (error) {
      return errorMessage("Error fetching course names")
    }
  }
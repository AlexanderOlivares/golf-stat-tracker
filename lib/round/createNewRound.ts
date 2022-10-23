import pool from "../../db/dbConfig";
import { INewRound } from "../../pages/[username]/round/new-round";
import { errorMessage, IErrorMessage } from "../user/register";

export async function createNewRound(newRoundArgs: INewRound): Promise<INewRound | IErrorMessage> {
  try {
    const newRound = await pool.query(
      "INSERT INTO round (round_id, course_name, course_id, username, hole_count, tee_color, round_date, front_or_back_nine, is_user_added_course, weather_conditions, temperature, user_added_course_name, user_added_city, user_added_state, unverified_course_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING *",
      Object.values(newRoundArgs)
    );

    if (!newRound.rowCount) {
      return errorMessage("Error creating new round");
    }

    const record: INewRound = newRound.rows[0];
    return record;
  } catch (error) {
    console.log(error);
    return errorMessage("Error creating new round");
  }
}

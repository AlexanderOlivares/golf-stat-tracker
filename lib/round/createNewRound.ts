import pool from "../../db/dbConfig";
import { IRoundRequestBody } from "../../pages/[username]/round/new-round";
import { errorMessage, IErrorMessage } from "../../utils/errorMessage";
import { createHoleDetailsJson, createHoleScoreArray } from "../../utils/roundFormatter";
import { defaultClubs } from "../selectOptions";

export async function createNewRound(
  newRoundArgs: IRoundRequestBody
): Promise<IRoundRequestBody | IErrorMessage> {
  try {
    const { username } = newRoundArgs;

    const clubsFromUserSettings = await pool.query("SELECT clubs FROM user_settings WHERE username = $1", [
        username,
      ]);

      let clubs = defaultClubs;

      if (clubsFromUserSettings.rowCount){
        clubs = clubsFromUserSettings.rows[0].clubs;
      }

    const newRound = await pool.query(
      "INSERT INTO round (round_id, course_name, course_id, username, hole_count, tee_color, round_date, front_or_back_nine, is_user_added_course, weather_conditions, temperature, user_added_course_name, user_added_city, user_added_state, unverified_course_id, clubs, hole_scores, hole_shot_details) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18) RETURNING *",
      [
        ...Object.values(newRoundArgs),
        clubs,
        createHoleScoreArray(),
        JSON.stringify(createHoleDetailsJson()),
      ]
    );

    if (!newRound.rowCount) {
      return errorMessage("Error creating new round");
    }

    let record: IRoundRequestBody = newRound.rows[0];
    if (!record.hole_shot_details) {
      return errorMessage("Error creating new round");
    }

    record.hole_shot_details = JSON.parse(record.hole_shot_details);

    return record;
  } catch (error) {
    console.log(error);
    return errorMessage("Error creating new round");
  }
}

export async function getRound(roundid: string): Promise<IRoundRequestBody | IErrorMessage> {
  try {
    const round = await pool.query("SELECT * FROM round WHERE round_id = $1", [roundid]);

    if (!round.rowCount) {
      return errorMessage("Error fetching round details");
    }

    round.rows[0].hole_shot_details = JSON.parse(round.rows[0].hole_shot_details);

    return round.rows[0];
  } catch (error) {
    console.log(error);
    return errorMessage("Error fetching round details");
  }
}

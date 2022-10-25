import pool from "../../db/dbConfig";
import { IRoundRequestBody } from "../../pages/[username]/round/new-round";
import { errorMessage, IErrorMessage } from "../user/register";
import { IShotDetail } from "../../utils/roundFormatter";
import { NON_HOLE_ROWS } from "../../utils/scoreCardFormatter";

export function createHoleScoreArray() {
  return Array.from({ length: 25 }, () => null);
}

// export enum NON_HOLE_ROWS {
//     out = 9,
//     in = 19,
//     total = 20,
//     rating = 21,
//     slope = 22,
//     HCP = 23,
//     NET = 24,
//   }

export function createHoleDetailsJson() {
  const defaultShotDetails: IShotDetail[] = [
    {
      shotNumber: 1,
      distanceToPin: null,
      club: null,
      result: null,
    },
  ];
  const shotDetailsArray = Array.from({ length: 25 }, (_, i) => {
    if (i in NON_HOLE_ROWS) {
      if (i < 21) {
        return [
          {
            fairwaysHit: null,
            greensInReg: null,
            threePutts: null,
            totalPutts: null,
          },
        ];
      } 
    }
    return defaultShotDetails;
  });
  return shotDetailsArray;
}

export async function createNewRound(
  newRoundArgs: IRoundRequestBody
): Promise<IRoundRequestBody | IErrorMessage> {
  try {
    const newRound = await pool.query(
      "INSERT INTO round (round_id, course_name, course_id, username, hole_count, tee_color, round_date, front_or_back_nine, is_user_added_course, weather_conditions, temperature, user_added_course_name, user_added_city, user_added_state, unverified_course_id, hole_scores, hole_shot_details) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) RETURNING *",
      [...Object.values(newRoundArgs), createHoleScoreArray(), createHoleDetailsJson()]
    );

    if (!newRound.rowCount) {
      return errorMessage("Error creating new round");
    }

    const record: IRoundRequestBody = newRound.rows[0];
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

    return round.rows[0];
  } catch (error) {
    console.log(error);
    return errorMessage("Error creating new round");
  }
}

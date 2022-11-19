import pool from "../../db/dbConfig";
import { errorMessage, IErrorMessage } from "../../utils/errorMessage";
import { IShotDetail } from "../../utils/roundFormatter";

export async function saveRoundDetails(
  holeScores: (number | null)[],
  holeShotDetails: IShotDetail[][],
  roundid: string
  // update the any type
): Promise<any | IErrorMessage> {
  try {
    const savedRound = await pool.query(
      `UPDATE round 
        SET hole_scores = ($1), hole_shot_details = ($2)
        WHERE round_id = ($3) 
        RETURNING hole_scores, hole_shot_details`,
      [holeScores, JSON.stringify(holeShotDetails), roundid]
    );

    if (!savedRound.rowCount) {
      return errorMessage("Error saving round details");
    }

    savedRound.rows[0].hole_shot_details = JSON.parse(savedRound.rows[0].hole_shot_details);

    return savedRound.rows[0];
  } catch (error) {
    console.log(error);
    return errorMessage("Error saving round details");
  }
}

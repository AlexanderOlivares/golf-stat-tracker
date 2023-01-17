import { IScoreCountByName } from "../../context/RoundContext";
import pool from "../../db/dbConfig";
import { errorMessage, IErrorMessage } from "../../utils/errorMessage";
import { IShotDetail } from "../../utils/roundFormatter";

export async function saveRoundDetails(
  holeScores: (number | null)[],
  holeShotDetails: IShotDetail[][],
  scoreCountByName: IScoreCountByName,
  roundid: string
  // update the any type
): Promise<any | IErrorMessage> {
  try {
    const {
      ace,
      albatross,
      eagle,
      birdie,
      parCount: par,
      bogey,
      doubleBogey,
      tripleBogey,
      quadBogeyOrWorse,
    } = scoreCountByName;

    const savedRound = await pool.query(
      `UPDATE round 
        SET hole_scores = ($1), 
        hole_shot_details = ($2),
        ace = ($3), 
        albatross = ($4),
        eagle = ($5),
        birdie = ($6),
        par = ($7),
        bogey = ($8),
        double_bogey = ($9),
        triple_bogey = ($10),
        quadruple_bogey_or_worse = ($11)
        WHERE round_id = ($12) 
        RETURNING 
        hole_scores, 
        hole_shot_details
        `,
      [
        holeScores,
        JSON.stringify(holeShotDetails),
        ace,
        albatross,
        eagle,
        birdie,
        par,
        bogey,
        doubleBogey,
        tripleBogey,
        quadBogeyOrWorse,
        roundid,
      ]
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

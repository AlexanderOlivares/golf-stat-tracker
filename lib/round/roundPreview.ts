import pool from "../../db/dbConfig";
import { IRoundPreview } from "../../pages/[username]/profile";
import { errorMessage, IErrorMessage } from "../../utils/errorMessage";
import { IShotDetail } from "../../utils/roundFormatter";
import { formatRoundPreviewGrid } from "../../utils/roundPreviewFormatter";

export interface IRoundPreviewDbResponse {
  round_id: string;
  course_id: string;
  course_name: string;
  tee_color: string;
  round_date: string;
  is_user_added_course: boolean;
  hole_scores: number[];
  hole_shot_details: IShotDetail[][];
}
export async function getRoundPreview(username: string): Promise<IRoundPreview[] | IErrorMessage> {
  try {

    const userRounds = await pool.query(
        `SELECT round_id, course_id, course_name, tee_color, round_date, is_user_added_course, hole_scores, hole_shot_details
            FROM round
            WHERE username = ($1)`, [username]
    );

    if (!userRounds.rowCount) {
      return errorMessage("Error loading saved round previews");
    }
 
    const unparsedRoundPreivews: IRoundPreviewDbResponse[] = userRounds.rows.map(row => {
        row.hole_shot_details = JSON.parse(row.hole_shot_details);
        return row;
    })

    const roundPreviews: IRoundPreview[] = formatRoundPreviewGrid(unparsedRoundPreivews);
    return roundPreviews;
  } catch (error) {
    console.log(error);
    return errorMessage("Error loading saved round previews");
  }
}
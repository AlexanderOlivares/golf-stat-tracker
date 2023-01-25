import pool from "../../db/dbConfig";
import { IRoundPreview } from "../../pages/[username]/profile";
import { errorMessage, IErrorMessage } from "../../utils/errorMessage";
import { IShotDetail } from "../../utils/roundFormatter";
import { formatRoundPreviewGrid } from "../../utils/roundPreviewFormatter";

export interface IRoundPreviewDbResponse {
  round_id: string;
  course_id: string;
  unverified_course_id: string;
  course_name: string;
  user_added_course_name: string;
  tee_color: string;
  round_date: string;
  is_user_added_course: boolean;
  ace: number | null;
  albatross: number | null;
  eagle: number | null;
  birdie: number | null;
  par: number | null;
  bogey: number | null;
  double_bogey: number | null;
  triple_bogey: number | null;
  quadruple_bogey_or_worse: number | null;
  hole_scores: number[];
  hole_shot_details: IShotDetail[][];
}
export async function getRoundPreview(username: string): Promise<IRoundPreview[] | IErrorMessage> {
  try {

    const userRounds = await pool.query(
        `SELECT round_id, course_id, unverified_course_id, course_name, tee_color, round_date, is_user_added_course, user_added_course_name, hole_scores, hole_shot_details, ace, albatross, eagle, birdie, par, bogey, double_bogey, triple_bogey, quadruple_bogey_or_worse
            FROM round
            WHERE username = ($1)`, [username]
    );

    if (!userRounds.rowCount) {
      return [];
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
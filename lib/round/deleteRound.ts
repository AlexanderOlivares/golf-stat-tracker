import pool from "../../db/dbConfig";
import { errorMessage, IErrorMessage } from "../../utils/errorMessage";

export async function deleteExistingRound(
  roundid: string,
  username: string
): Promise<any | IErrorMessage> {
  try {
    const deletedRound = await pool.query(
      `DELETE from round 
        WHERE round_id = ($1) AND username = ($2) 
        RETURNING *`,
      [roundid, username]
    );

    if (!deletedRound.rowCount) {
      return errorMessage("Error deleting round details");
    }

    return deletedRound.rows[0];
  } catch (error) {
    console.log(error);
    return errorMessage("Error deleting round details");
  }
}
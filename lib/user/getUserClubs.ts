import pool from "../../db/dbConfig";
import { errorMessage, IErrorMessage } from "../../utils/errorMessage";

export async function getUserClubs(username: string) {
  try {
    const { rows } = await pool.query("SELECT * FROM user_settings WHERE username = $1", [
      username,
    ]);
    return { ...rows[0] };
  } catch (error) {
    console.log(error);
    return errorMessage("Error loading clubs");
  }
}

export async function updateUserClubs(clubs: string[], username: string) {
  try {
    const result  = await pool.query(
      "UPDATE user_settings SET clubs = $1 WHERE username = $2 RETURNING clubs",
      [clubs, username]
    );

    if (!result.rowCount) return clubs;
    return result.rows[0];
  } catch (error) {
    console.log(error);
    return errorMessage("Error loading clubs");
  }
}

import pool from "../../db/dbConfig";
  
export async function getUserClubs(username: string) {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM user_settings WHERE username = $1",
      [username]
    );
    return { ...rows[0] };
  } catch (error) {
    console.log(error);
    return { message: "Error fetching user data" };
  }
}
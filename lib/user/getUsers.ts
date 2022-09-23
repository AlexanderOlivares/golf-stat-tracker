  import pool from "../../db/dbConfig";
  
  export async function getUsers() {
    try {
      const { rows } = await pool.query("SELECT * FROM user_login");
      return [...rows]
    } catch (error) {
      console.log(error);
      return { message: "Error fetching user data" };
    }
  }

  export  async function getUser(username: string) {
    try {
      const { rows } = await pool.query(
        "SELECT * FROM user_login WHERE username = $1",
        [username]
      );
      return { ...rows[0] };
    } catch (error) {
      console.log(error);
      return { message: "Error fetching user data" };
    }
  }
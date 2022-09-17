import {
  usernameAndPasswordValidator,
  emailAddressValidator,
} from "../../utils/formValidator";
import { jwtGenerator } from "../../utils/jwtGenerator";
import pool from "../../db/dbConfig";
import bcrypt from "bcrypt";

export default async function loginUser(email: string, password: string) {
  try {
    const isValidEmailAddress = emailAddressValidator(email);
    const isValidPassword = usernameAndPasswordValidator(password);
    if (!isValidEmailAddress || !isValidPassword) {
      return { message: "Invalid form input" };
    }

    const user = await pool.query("SELECT * FROM user_login WHERE email = $1", [
      email,
    ]);

    if (!user.rowCount) {
      return { message: "No account exists with that email" };
    }

    const savedPassword: string = user.rows[0].password;
    const passwordsMatch: boolean = await bcrypt.compare(password, savedPassword);

    if (!passwordsMatch) {
      return { message: "Password is incorrect" };
    }

    const userid: string = user.rows[0].userid;
    const username: string = user.rows[0].username;

    const token: string = await jwtGenerator(userid, username, email);

    return {
      userid,
      username,
      email,
      token,
    };
  } catch (error) {
    return { message: "Error logging in. Please try again later." };
  }
}

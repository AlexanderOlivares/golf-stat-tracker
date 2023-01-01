import { usernameAndPasswordValidator, emailAddressValidator } from "../../utils/formValidator";
import { jwtGenerator } from "../../utils/jwtGenerator";
import pool from "../../db/dbConfig";
import bcrypt from "bcryptjs";
import { IUser  } from "./register";
import { errorMessage } from "../../utils/errorMessage";

export default async function loginUser(email: string, password: string) {
  try {
    const lowerCasedEmail = email.toLowerCase();

    const isValidEmailAddress = emailAddressValidator(lowerCasedEmail);
    const isValidPassword = usernameAndPasswordValidator(password);
    if (!isValidEmailAddress || !isValidPassword) {
      return errorMessage("Invalid form input");
    }

    const user = await pool.query("SELECT * FROM user_login WHERE email = $1", [lowerCasedEmail]);

    if (!user.rowCount) return errorMessage("No account exists with that email");

    const savedPassword: string = user.rows[0].password;
    const passwordsMatch: boolean = await bcrypt.compare(password, savedPassword);

    if (!passwordsMatch) return errorMessage("Password is incorrect");

    const userid: string = user.rows[0].userid;
    const username: string = user.rows[0].username;

    const token: string = await jwtGenerator(userid, username, lowerCasedEmail);
    const loggedInUser: IUser = {
      userid,
      username,
      email: lowerCasedEmail,
      token,
    };

    return loggedInUser;
  } catch (error) {
    console.log(error);
    return errorMessage("Error logging in. Please try again later.");
  }
}

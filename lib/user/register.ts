import {
  usernameAndPasswordValidator,
  emailAddressValidator,
} from "../../utils/formValidator";
import { jwtGenerator } from "../../utils/jwtGenerator";
import pool from "../../db/dbConfig";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

export default async function registerUser(
  username: string,
  email: string,
  password: string
) {
  try {
    const isValidEmailAddress = emailAddressValidator(email);
    const isValidUsername = usernameAndPasswordValidator(username);
    const isValidPassword = usernameAndPasswordValidator(password);
    if (!isValidUsername || !isValidEmailAddress || !isValidPassword) {
      return { message: "Invalid form input" };
    }

    const usernameExists = await pool.query(
      "SELECT username FROM user_login WHERE username = $1",
      [username]
    );

    const emailExists = await pool.query(
      "SELECT email FROM user_login WHERE email = $1",
      [email]
    );

    if (usernameExists.rowCount) {
      return { message: "Username already exists" };
    }

    if (emailExists.rowCount) {
      return { message: "Account with that email already exists" };
    }

    const SALT_ROUNDS = 10;
    const salt: string = await bcrypt.genSalt(SALT_ROUNDS);
    const bcryptPassword: string = await bcrypt.hash(password, salt);

    const userid: string = uuidv4();

    const token = await jwtGenerator(userid, username, email);

    const newUser = await pool.query(
      "INSERT INTO user_login (userid, username, email, password) VALUES ($1, $2, $3, $4) RETURNING *",
      [userid, username, email, bcryptPassword]
    );

    if (!newUser.rowCount) {
      return { message: "Error creating user account. Please try again later." };
    }

    return {
      userid,
      username,
      email,
      token,
    };
  } catch (error) {
    return { message: "Error creating user account. Please try again later." };
  }
}

import { usernameAndPasswordValidator, emailAddressValidator } from "../../utils/formValidator";
import { jwtGenerator } from "../../utils/jwtGenerator";
import pool from "../../db/dbConfig";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

export interface IUser {
  userid: string;
  username: string;
  email: string;
  token: string;
}

export interface IErrorMessage {
  errorMessage: string;
}

export const errorMessage = (errorMessage: string): IErrorMessage => {
  return { errorMessage };
};

export default async function registerUser(username: string, email: string, password: string) {
  try {
    const isValidEmailAddress = emailAddressValidator(email);
    const isValidUsername = usernameAndPasswordValidator(username);
    const isValidPassword = usernameAndPasswordValidator(password);
    if (!isValidUsername || !isValidEmailAddress || !isValidPassword) {
      return errorMessage("Invalid form input");
    }

    const usernameExists = await pool.query("SELECT username FROM user_login WHERE username = $1", [
      username,
    ]);

    if (usernameExists.rowCount) {
      return errorMessage("Username already exists");
    }

    const emailExists = await pool.query("SELECT email FROM user_login WHERE email = $1", [email]);

    if (emailExists.rowCount) {
      return errorMessage("Account with that email already exists");
    }

    const SALT_ROUNDS = 10;
    const salt: string = bcrypt.genSaltSync(SALT_ROUNDS);
    const bcryptPassword: string = bcrypt.hashSync(password, salt);

    const userid: string = uuidv4();

    const token: string = await jwtGenerator(userid, username, email);

    const newUser = await pool.query(
      "INSERT INTO user_login (userid, username, email, password) VALUES ($1, $2, $3, $4) RETURNING *",
      [userid, username, email, bcryptPassword]
    );

    if (!newUser.rowCount) {
      return errorMessage("Error creating user account. Please try again later.");
    }

    const user: IUser = {
      userid,
      username,
      email,
      token,
    };

    return user;
  } catch (error) {
    return errorMessage("Error creating user account. Please try again later.");
  }
}

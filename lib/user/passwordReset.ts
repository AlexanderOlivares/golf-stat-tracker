import { emailAddressValidator } from "../../utils/formValidator";
import { jwtGenerator, passwordResetJwtGenerator, verify } from "../../utils/jwtGenerator";
import pool from "../../db/dbConfig";
import { errorMessage } from "../../utils/errorMessage";
const nodemailer = require("nodemailer");
import bcrypt from "bcryptjs";
import { IUser, SALT } from "./register";

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export default async function passwordResetEmailRequest(email: string) {
  try {
    const isValidEmailAddress = emailAddressValidator(email);
    if (!isValidEmailAddress) {
      return errorMessage("Invalid form input");
    }

    const user = await pool.query("SELECT * FROM user_login WHERE email = $1", [email]);

    if (!user.rowCount) return errorMessage("No account exists with that email");

    const savedPassword: string = user.rows[0].password;

    const userid: string = user.rows[0].userid;
    const username: string = user.rows[0].username;
    const token: string = await passwordResetJwtGenerator(userid, username, email, savedPassword);

    const base64Encode = (strToEncode: string) => Buffer.from(strToEncode).toString("base64");
    const encodedEmail = base64Encode(email);

    const DOMAIN = process.env.DOMAIN;
    // send email here
    const mailOptions = {
      from: `Golf Logs <${process.env.EMAIL_USERNAME}>`,
      to: email,
      subject: "Reset Password",
      html: `
              <p>Use the link below to reset your password. Link expires in 10 minutes.</p>
              <div>
                  <a href="${DOMAIN}/password-reset?email=${encodedEmail}&token=${token}">Click here to reset golfer account password</a>
              </div>
              <br>
              <small>Please do not reply to this email.</small>
              `,
    };

    await transporter.sendMail(mailOptions);

    return true;
  } catch (error) {
    console.log(error);
    return errorMessage("Error sending password reset email. Please try again later.");
  }
}

export async function resetPassword(email: string, password: string, resetToken: string) {
  try {
    const user = await pool.query("SELECT * FROM user_login WHERE email = $1", [email]);

    if (!user.rowCount) return errorMessage("No account exists with that email");

    const userid: string = user.rows[0].userid;
    const username: string = user.rows[0].username;

    const hashedPassword: string = user.rows[0].password;
    const secret = process.env.JWT_SECRET + hashedPassword;

    const resetPasswordToken = await verify(resetToken, secret);
    const bcryptPassword: string = bcrypt.hashSync(password, SALT);

    const updatedUser = await pool.query(
      "UPDATE user_login SET password = $1 WHERE email = $2 RETURNING *",
      [bcryptPassword, resetPasswordToken?.email]
    );

    if (!updatedUser.rowCount) {
      return errorMessage("Error resetting password. Please try again later");
    }

    const accessToken: string = await jwtGenerator(userid, username, email);

    const userObj: IUser = {
      userid,
      username,
      email,
      token: accessToken,
    };

    return userObj;
  } catch (error) {
    console.log(error);
    return errorMessage("Error resetting password. Please try again later");
  }
}

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
    const lowerCasedEmail = email.toLowerCase();

    const isValidEmailAddress = emailAddressValidator(lowerCasedEmail);
    if (!isValidEmailAddress) {
      return errorMessage("Invalid email address format");
    }

    const user = await pool.query("SELECT * FROM user_login WHERE email = $1", [lowerCasedEmail]);

    if (!user.rowCount) return errorMessage("No account exists with that email");

    const savedPassword: string = user.rows[0].password;

    const userid: string = user.rows[0].userid;
    const username: string = user.rows[0].username;
    const token: string = await passwordResetJwtGenerator(userid, username, lowerCasedEmail, savedPassword);

    const base64Encode = (strToEncode: string) => Buffer.from(strToEncode).toString("base64");
    const encodedEmail = base64Encode(lowerCasedEmail);

    const DOMAIN =  process.env.DOMAIN;
    const PROTOCOL = process.env.NODE_ENV == "production" ? "https" : "http";
    // send email here
    const mailOptions = {
      from: `Golf Logs <${process.env.EMAIL_USERNAME}>`,
      to: lowerCasedEmail,
      subject: "Reset Password",
      html: `
              <p>Use the link below to reset your password. Link expires in 10 minutes.</p>
              <div>
                  <a href="${PROTOCOL}://${DOMAIN}/password-reset?email=${encodedEmail}&token=${token}">Click here to reset golfer account password</a>
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
    const lowerCasedEmail = email.toLowerCase();

    const user = await pool.query("SELECT * FROM user_login WHERE email = $1", [lowerCasedEmail]);

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

    const accessToken: string = await jwtGenerator(userid, username, lowerCasedEmail);

    const userObj: IUser = {
      userid,
      username,
      email: lowerCasedEmail,
      token: accessToken,
    };

    return userObj;
  } catch (error) {
    console.log(error);
    return errorMessage("Error resetting password. Please try again later");
  }
}

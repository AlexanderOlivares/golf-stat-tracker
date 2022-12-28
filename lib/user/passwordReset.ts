import { emailAddressValidator } from "../../utils/formValidator";
import { passwordResetJwtGenerator } from "../../utils/jwtGenerator";
import pool from "../../db/dbConfig";
import { errorMessage } from "../../utils/errorMessage";
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service:process.env.EMAIL_SERVICE,
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
  
    const base64Encode = (strToEncode:string) => Buffer.from(strToEncode).toString("base64");
    const encodedEmail = base64Encode(email);

    const domain = "http://localhost:3000";
    // send email here
    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: email,
      subject: "Reset Password",
      html: `
              <p>Use the link below to reset your password. Link expires in 10 minutes.</p>
              <div>
                  <a href="${domain}/password-reset?email=${encodedEmail}&token=${token}">Click here to reset golfer account password</a>
              </div>
              <br>
              <small>Please do not reply to this email.</small>
              `,
    };

    // const res = await transporter.sendMail(mailOptions);


    await transporter.sendMail(mailOptions, (error: Error, info: any) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    return true;
  } catch (error) {
    console.log(error);
    return errorMessage("Error sending password reset email. Please try again later.");
  }
}

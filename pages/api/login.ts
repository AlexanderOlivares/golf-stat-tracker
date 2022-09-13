import type { NextApiRequest, NextApiResponse } from "next";
import {
    usernameAndPasswordValidator,
    emailAddressValidator,
} from "../../utils/formValidator";
import { jwtGenerator } from "../../utils/jwtGenerator";
import pool from "../../db/dbConfig";
import bcrypt from "bcrypt";
import cookie from "cookie";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { email, password } = req.body;
    try {
        const isValidEmailAddress = emailAddressValidator(email);
        const isValidPassword = usernameAndPasswordValidator(password);

        if (!isValidEmailAddress || !isValidPassword) {
            return res.status(400).json({ message: "Invalid form input" });
        }

        // update with graphql query
        const user = await pool.query("SELECT * FROM user_login WHERE email = $1", [
            email,
        ]);

        if (!user.rowCount) {
            return res.status(400).json({ message: "No account exists with that email" });
        }


        const savedPassword: string = user.rows[0].password;
        const passwordsMatch: boolean = await bcrypt.compare(password, savedPassword);

        if (!passwordsMatch) {
            return res.status(401).json("Password is incorrect");
        }


        const userId: string = user.rows[0].user_id;
        const username: string = user.rows[0].user_name;

        const token: string = await jwtGenerator(userId, username, email);

        res.setHeader(
            "Set-Cookie",
            cookie.serialize("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV !== "development",
                maxAge: 60 * 60 * 24 * 7, // 1 week
                sameSite: "strict",
                path: "/",
            })
        )

        return res.status(200).json({ message: `Welcome back ${username}!`, userId });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "error" });
    }
}
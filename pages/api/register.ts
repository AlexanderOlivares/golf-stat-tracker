import type { NextApiRequest, NextApiResponse } from "next";
import {
    usernameAndPasswordValidator,
    emailAddressValidator,
} from "../../utils/formValidator";
import { jwtGenerator } from "../../utils/jwtGenerator";
import pool from "../../db/dbConfig";
import bcrypt from "bcrypt";
import cookie from "cookie";
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { username, email, password } = req.body;
    try {
        const isValidEmailAddress = emailAddressValidator(email);
        const isValidUsername = usernameAndPasswordValidator(username);
        const isValidPassword = usernameAndPasswordValidator(password);
        if (!isValidUsername || !isValidEmailAddress || !isValidPassword) {
            return res.status(400).json({ message: "Invalid form input" });
        }

        // update with graphql query
        const usernameExists = await pool.query("SELECT username FROM user_login WHERE username = $1", [
            username,
        ]);

        // update with graphql query
        const emailExists = await pool.query("SELECT email FROM user_login WHERE email = $1", [
            email,
        ]);

        if (usernameExists.rowCount) {
            return res.status(409).json({ message: "Username already exists" });
        }

        if (emailExists.rowCount) {
            return res.status(409).json({ message: "Account with that email already exists" });
        }

        const SALT_ROUNDS = 10;
        const salt = await bcrypt.genSalt(SALT_ROUNDS);
        const bcryptPassword = await bcrypt.hash(password, salt);

        const userId = uuidv4();

        const token = await jwtGenerator(userId, username, email);

        const newUser = await pool.query(
            "INSERT INTO user_login (userid, username, email, password) VALUES ($1, $2, $3, $4) RETURNING *",
            [userId, username, email, bcryptPassword]
        );

        if (!newUser.rowCount) {
            return res.status(500).send({ message: "Error creating user account. Please try again later." })
        }

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

        return res.status(201).json({ message: "account created", userId });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: "Error creating user account. Please try again later." })
    }
}
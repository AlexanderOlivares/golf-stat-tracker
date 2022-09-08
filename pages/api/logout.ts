import type { NextApiRequest, NextApiResponse } from "next";
import cookie from "cookie";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {

        res.setHeader(
            "Set-Cookie",
            cookie.serialize("token", "", {
                httpOnly: true,
                secure: process.env.NODE_ENV !== "development",
                maxAge: -1,
                sameSite: "strict",
                path: "/",
            })
        )

        return res.status(200).json({ message: "successfully logged out"});
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "error" });
    }
}
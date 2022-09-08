import jsonwebtoken from "jsonwebtoken";

function jwtGenerator(userId: string, userName: string, email: string) {
    const payload = {
        userId,
        userName,
        email
    };

    return jsonwebtoken.sign(payload, process.env.JWT_SECRET as string, {
        expiresIn: process.env.JWT_EXPIRE as string,
    });
}

export default jwtGenerator;


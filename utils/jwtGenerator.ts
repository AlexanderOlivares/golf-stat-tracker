import { SignJWT, jwtVerify } from 'jose';

export async function jwtGenerator(userId: string, userName: string, email: string) {
    const payload = {
        userId,
        userName,
        email
    };

    const token = await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
        .setExpirationTime(process.env.JWT_EXPIRE as string)
        .sign(new TextEncoder().encode(process.env.JWT_SECRET))

    return token;
}

export async function verify(token: string, secret: string) {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
    console.log(payload)
    return payload;
}

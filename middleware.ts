import { NextResponse, NextRequest } from 'next/server'
import { verify } from "./utils/jwtGenerator"

export async function middleware(request: NextRequest) {
    const { url } = request;
    const token = request.cookies.get('token');

    const baseUrl = process.env.NODE_ENV === "production" ? "prodUrl" : 'http:localhost:3000';
    const redirectToLogin = () => NextResponse.redirect(`${baseUrl}/login`);

    if (url.includes("/profile")) {
        try {
            if (!token) return redirectToLogin();

            const user = await verify(token, String(process.env.JWT_SECRET));

            if (!user) return redirectToLogin();

        } catch (error) {
            console.log(error);
            return redirectToLogin();
        }
    }

    return NextResponse.next();
}

// See "Matching Paths" below to learn more
// export const config = {
//   matcher: '/about/:path*',
// }
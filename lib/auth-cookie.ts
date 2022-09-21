import cookie, { parse } from "cookie";

const TOKEN_NAME: string = process.env.TOKEN_NAME || "token";

export function setAuthCookie(res: any, token: string) {
  res.setHeader(
    "Set-Cookie",
    cookie.serialize(TOKEN_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      sameSite: "strict",
      path: "/",
    })
  );
}

export function removeAuthCookie(res: any) {
  res.setHeader(
    "Set-Cookie",
    cookie.serialize(TOKEN_NAME, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      maxAge: -1,
      sameSite: "strict",
      path: "/",
    })
  );
}

export function validateAuthCookie(res: any) {
  res.setHeader(
    "Set-Cookie",
    cookie.serialize(TOKEN_NAME, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      maxAge: -1,
      sameSite: "strict",
      path: "/",
    })
  );
}

export function parseCookies(req: any)  {
  // For API Routes we don't need to parse the cookies.
  if (req.cookies) return req.cookies;

  // For pages we do need to parse the cookies.
  const cookie = req.headers?.cookie;
  return parse(cookie || "");
}

export function getAuthCookie(req: any) :string {
  const cookies = parseCookies(req);
  return cookies[TOKEN_NAME];
}

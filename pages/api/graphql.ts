import { ApolloServer } from "apollo-server-micro";
import { NextApiResponse, NextApiRequest } from "next";
import { typeDefs } from "./graphql/type-defs";
import { resolvers } from "./graphql/resolvers";
import pool from "../../db/dbConfig";
import { validateAuthCookie } from "../../lib/auth-cookie";
import { IErrorMessage } from "../../utils/errorMessage";
import { JWTPayload } from "jose";

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req, res }) => {
    const token: JWTPayload| IErrorMessage= await validateAuthCookie(req);
    console.log(token);
    return {
      req,
      res,
      pool,
      token,
    };
  },
});

const startServer = apolloServer.start();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Access-Control-Allow-Origin", "https://studio.apollographql.com");

  res.setHeader("Access-Control-Allow-Methods", "POST");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.end();
    return false;
  }

  await startServer;
  await apolloServer.createHandler({
    path: "/api/graphql",
  })(req, res);
}

export const config = {
  api: {
    bodyParser: false,
  },
};

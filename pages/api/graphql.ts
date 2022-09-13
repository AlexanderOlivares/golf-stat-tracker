import { ApolloServer, gql } from 'apollo-server-micro';
import { NextApiResponse, NextApiRequest } from 'next';

const typeDefs = gql`
  type User {
    userId: String
    username: String
    email: String
    password: String
  }

  type Query {
    users: [User]!
  } 
`;

const users = [{
    userId: 1234,
    username: "alex",
    email: "alex@email.com",
    password: "pasword"
},
{
    userId: 5678,
    username: "jaxx",
    email: "jaxx@email.com",
    password: "pasword"
}
]

const resolvers = {
    Query: {
        users: () => [...users],
    },
};

const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
});

const startServer = apolloServer.start();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method === "OPTIONS") {
        res.end();
        return false;
    }

    res.setHeader(
        'Access-Control-Allow-Origin',
        'https://studio.apollographql.com',
    );
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Headers', ' Content-Type');

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

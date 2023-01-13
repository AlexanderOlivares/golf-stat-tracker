import { ApolloClient, InMemoryCache } from "@apollo/client";
import { onError } from "@apollo/client/link/error";

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );
  if (networkError) console.log(`[Network error]: ${networkError}`);
});

const absolutePath = `${process.env.NEXT_PUBLIC_VERCEL_URL}/api/graphql`;
const apolloClient = new ApolloClient({
  uri: process.env.NODE_ENV == "production" ? `/api/graphql` : absolutePath,
  cache: new InMemoryCache(),
});

export default apolloClient;
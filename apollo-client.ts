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

const protocol = process.env.NODE_ENV == "production" ? "https" : "http";
const apolloClient = new ApolloClient({
  uri: `${protocol}://${process.env.DOMAIN}/api/graphql`,
  cache: new InMemoryCache(),
});

export default apolloClient;
import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import fetch from 'cross-fetch';

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
  link: new HttpLink({
  uri: `${protocol}://${process.env.NEXT_PUBLIC_DOMAIN}/api/graphql`,
  fetch,
  }),
//   uri: `${protocol}://${process.env.NEXT_PUBLIC_DOMAIN}/api/graphql`,
  cache: new InMemoryCache(),
});

export default apolloClient;
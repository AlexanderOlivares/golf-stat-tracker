import { ApolloClient, ApolloLink, HttpLink, InMemoryCache } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import fetch from 'cross-fetch';

const protocol = process.env.NODE_ENV == "production" ? "https" : "http";

const apolloClient = new ApolloClient({
  link: ApolloLink.from([
    onError(({ graphQLErrors, networkError }) => {
        if (graphQLErrors)
            graphQLErrors.forEach(({ message, locations, path }) =>
            console.log(
                `[GraphQL error]: Message: ${message}, Location: ${JSON.stringify(locations, null, 2)}, Path: ${path}`
            )
            );
        if (networkError) console.log(`[Network error]: ${networkError}`);
    }),
    new HttpLink({
        uri: `${protocol}://${process.env.NEXT_PUBLIC_DOMAIN}/api/graphql`,
        fetch,
    })
  ]),
  cache: new InMemoryCache(),
});

export default apolloClient;
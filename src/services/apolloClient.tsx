import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
const GRAPHQL_URL = import.meta.env.GRAPHQL_URL || "http://localhost:10000/graphql";

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: GRAPHQL_URL,
  }),
});

export default client;
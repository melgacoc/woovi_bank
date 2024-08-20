import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
    uri: import.meta.env.VITE_GRAPHQL_URL || "http://localhost:10001/graphql",
    cache: new InMemoryCache(),
});

export default client;
